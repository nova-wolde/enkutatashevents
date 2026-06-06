import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Rate Limiting Store (with memory cap) ──────────────────────────────────
const MAX_STORE_SIZE = 10_000; // Cap to prevent unbounded memory growth
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60;        // 60 requests per minute per IP (general)

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    // Evict oldest entry if store is full
    if (rateLimitMap.size >= MAX_STORE_SIZE) {
      const oldestKey = rateLimitMap.keys().next().value;
      if (oldestKey) rateLimitMap.delete(oldestKey);
    }
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// ─── Stricter rate limit for login endpoint ─────────────────────────────────
const LOGIN_RATE_LIMIT_MAX = 10; // 10 requests per minute for login
const loginRateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isLoginRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = loginRateLimitMap.get(key);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    if (loginRateLimitMap.size >= 1_000) {
      const oldestKey = loginRateLimitMap.keys().next().value;
      if (oldestKey) loginRateLimitMap.delete(oldestKey);
    }
    loginRateLimitMap.set(key, { count: 1, lastReset: now });
    return false;
  }

  entry.count++;
  if (entry.count > LOGIN_RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// ── Clean up stale entries periodically ──────────────────────────────────────
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    // General rate limit cleanup
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now - entry.lastReset > RATE_LIMIT_WINDOW * 2) {
        rateLimitMap.delete(key);
      }
    }
    // Login rate limit cleanup
    for (const [key, entry] of loginRateLimitMap.entries()) {
      if (now - entry.lastReset > RATE_LIMIT_WINDOW * 2) {
        loginRateLimitMap.delete(key);
      }
    }
  }, 120_000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. HTTPS Enforcement (production only, only for direct access) ──────
  if (process.env.NODE_ENV === "production") {
    const forwarded = request.headers.get("x-forwarded-for");
    const proto = request.headers.get("x-forwarded-proto");
    if (!forwarded && proto === "http") {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = "https";
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // ── 2. Stricter rate limit on login endpoint ────────────────────────────
  if (pathname === "/api/auth/login") {
    const key = getRateLimitKey(request);
    if (isLoginRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  // ── 3. General Rate Limiting on API Routes ──────────────────────────────
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // ── 4. Block Access to Sensitive Paths ──────────────────────────────────
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
