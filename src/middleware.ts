import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Rate Limiting Store ──────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60;        // 60 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Clean up stale entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now - entry.lastReset > RATE_LIMIT_WINDOW * 2) {
        rateLimitMap.delete(key);
      }
    }
  }, 120_000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. HTTPS Enforcement (production only, only for direct access) ──────
  // When behind a reverse proxy (Caddy, Nginx, Cloudflare, etc.), TLS
  // termination happens at the proxy layer.  The proxy forwards requests
  // to us over plain HTTP, so we must NOT redirect in that case.
  // Only redirect when the client hits us directly (no proxy headers).
  if (process.env.NODE_ENV === "production") {
    const forwarded = request.headers.get("x-forwarded-for");
    const proto = request.headers.get("x-forwarded-proto");
    // Only redirect if there's no proxy (direct access) and proto is http
    if (!forwarded && proto === "http") {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = "https";
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // ── 2. Rate Limiting on API Routes ────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // ── 3. Block Access to Sensitive Paths ────────────────────────────────────
  const blockedPaths = ["/.env", "/.git", "/admin", "/prisma", "/db"];
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
