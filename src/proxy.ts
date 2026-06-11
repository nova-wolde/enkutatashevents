import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// ─── Redis-Backed Rate Limiting (works across Cloudflare Workers isolates) ────
// On Workers, in-memory Maps don't persist across requests.
// We use Upstash Redis for persistent rate limiting.
// If Redis is not configured, we fall back to a permissive approach (no rate limiting).

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis !== null) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

/**
 * Get the real visitor IP.
 * On Cloudflare Workers, the real IP is in `cf-connecting-ip`.
 * Falls back to `x-forwarded-for` for other hosting.
 */
function getClientIP(request: NextRequest): string {
  // Cloudflare-specific header — always contains the real visitor IP
  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  // Fallback for other hosting
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

// ─── Rate Limit Configuration ────────────────────────────────────────────────
// Different endpoints have different tolerance for traffic.
// Read-only endpoints (content, events, health) are safe at high limits.
// Write endpoints (login, contact, bookings) need stricter protection.

const RATE_LIMITS: Record<string, { max: number; window: number }> = {
  // Sensitive writes — strict limits
  login:    { max: 10,  window: 60 },   // 10 login attempts per minute per IP
  contact:  { max: 5,   window: 60 },   // 5 contact form submissions per minute
  booking:  { max: 10,  window: 60 },   // 10 booking submissions per minute

  // General reads — generous limits
  api_read: { max: 300, window: 60 },   // 300 API reads per minute per IP
};

/**
 * Determine which rate limit bucket a request falls into.
 */
function getRateLimitBucket(pathname: string): string {
  if (pathname === "/api/auth/login") return "login";
  if (pathname === "/api/contact") return "contact";
  if (pathname === "/api/bookings" || pathname === "/api/events") return "booking";
  if (pathname.startsWith("/api/")) return "api_read";
  return "api_read"; // default for non-API routes
}

/**
 * Check rate limit using Upstash Redis INCR + EXPIRE.
 * Returns true if the request should be blocked (rate limited).
 */
async function isRateLimited(
  ip: string,
  bucket: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    // No Redis configured — skip rate limiting (development fallback)
    return false;
  }

  try {
    const redisKey = `ratelimit:${bucket}:${ip}`;
    // Atomically increment and set expiry
    const count = await redis.incr(redisKey);
    if (count === 1) {
      // First request in this window — set the TTL
      await redis.expire(redisKey, windowSeconds);
    }
    return count > maxRequests;
  } catch {
    // If Redis fails, don't block the request
    return false;
  }
}

// ── Next.js 16 proxy.ts convention (replaces middleware.ts) ────────────────────
export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ── 1. HTTPS Enforcement (production only) ──────────────────────────────
  const isProduction =
    process.env.NODE_ENV === "production" ||
    request.headers.get("x-forwarded-proto") === "https";
  if (isProduction) {
    const forwarded = request.headers.get("x-forwarded-for");
    const proto = request.headers.get("x-forwarded-proto");
    if (!forwarded && proto === "http") {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = "https:";
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // ── 2. Rate Limiting on API Routes ──────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(request);
    const bucket = getRateLimitBucket(pathname);
    const limits = RATE_LIMITS[bucket];
    const limited = await isRateLimited(ip, bucket, limits.max, limits.window);
    if (limited) {
      const isLogin = pathname === "/api/auth/login";
      return NextResponse.json(
        {
          error: isLogin
            ? "Too many login attempts. Please try again later."
            : "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }
  }

  // ── 3. Block Access to Sensitive Paths ──────────────────────────────────
  const blockedPaths = ["/.env", "/.git", "/prisma", "/db"];
  if (blockedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|events/|enkutatash-logo|apple-touch-icon|og-image|manifest\\.json).*)",
  ],
};
