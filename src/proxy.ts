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

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP (general)
const LOGIN_RATE_LIMIT_MAX = 10; // 10 requests per minute for login

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Check rate limit using Upstash Redis INCR + EXPIRE.
 * Returns true if the request should be blocked (rate limited).
 */
async function isRateLimited(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    // No Redis configured — skip rate limiting (development fallback)
    return false;
  }

  try {
    const redisKey = `ratelimit:${key}:${maxRequests}`;
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
  // Use URL constructor instead of request.nextUrl for Cloudflare Workers compatibility
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ── 1. HTTPS Enforcement (production only, only for direct access) ──────
  // On Cloudflare Workers, HTTPS is always enforced by Cloudflare itself.
  // We keep this as a safety net for local development or other hosting.
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

  // ── 2. Stricter rate limit on login endpoint ────────────────────────────
  if (pathname === "/api/auth/login") {
    const key = getRateLimitKey(request);
    const limited = await isRateLimited(key, LOGIN_RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    if (limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  // ── 3. General Rate Limiting on API Routes ──────────────────────────────
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    const limited = await isRateLimited(key, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // ── 4. Block Access to Sensitive Paths ──────────────────────────────────
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
