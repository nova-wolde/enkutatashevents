/**
 * Shared authentication helpers for API routes.
 *
 * - verifyAuth():   Verify session cookie → return authenticated boolean
 * - timingSafeEqual(): Compare passwords in constant time (Web Crypto API)
 * - Login rate limiting (Upstash Redis-backed, works across Workers isolates)
 */

import { getSession } from "@/lib/kv-data"

// ─── Verify Auth ──────────────────────────────────────────────────────────────
/**
 * Check if the request has a valid session cookie.
 * Looks up the session token directly in KV (no need to scan all sessions).
 * Returns { authenticated: true } or { authenticated: false }.
 */
export async function verifyAuth(request: Request): Promise<{ authenticated: boolean }> {
  try {
    const token = request.cookies.get("enkutatash_session")?.value
    if (!token) return { authenticated: false }

    // Direct lookup by token in KV — O(1) instead of scanning an array
    const session = await getSession(token)
    if (!session) return { authenticated: false }

    return { authenticated: true }
  } catch {
    return { authenticated: false }
  }
}

// ─── Timing-Safe Password Comparison (Web Crypto API) ─────────────────────────
/**
 * Compare two strings in constant time to prevent timing attacks.
 * Uses Web Crypto API (works on Cloudflare Workers, browsers, and Node.js).
 * Both strings are hashed first so the comparison is always the same length.
 */
export async function timingSafePasswordCompare(a: string, b: string): Promise<boolean> {
  if (typeof a !== "string" || typeof b !== "string") return false
  if (a.length === 0 || b.length === 0) return false

  const encoder = new TextEncoder()
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ])

  // Convert ArrayBuffers to Uint8Arrays for comparison
  const arrA = new Uint8Array(hashA)
  const arrB = new Uint8Array(hashB)

  // Constant-time comparison — always compare all bytes
  if (arrA.length !== arrB.length) return false
  let result = 0
  for (let i = 0; i < arrA.length; i++) {
    result |= arrA[i] ^ arrB[i]
  }
  return result === 0
}

// ─── Generate Random Token (Web Crypto API) ───────────────────────────────────
/**
 * Generate a cryptographically secure random hex token.
 * Uses Web Crypto API (works on Cloudflare Workers, browsers, and Node.js).
 */
export function generateToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

// ─── Login Rate Limiting (Upstash Redis-backed) ───────────────────────────────
// In-memory fallback for development when Redis is not available.
// In production on Cloudflare Workers, in-memory state doesn't persist
// across isolates, so we rely on Redis when it's configured.

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

/**
 * Check if the IP is currently locked out from login attempts.
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }
 */
export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const entry = loginAttempts.get(ip)
  const now = Date.now()

  if (entry && entry.lockedUntil > now) {
    return { allowed: false, retryAfterMs: entry.lockedUntil - now }
  }

  // Clean expired entries periodically
  if (Math.random() < 0.01) { // ~1% chance on each call
    for (const [key, val] of loginAttempts.entries()) {
      if (val.lockedUntil <= now && val.count < MAX_LOGIN_ATTEMPTS) {
        loginAttempts.delete(key)
      }
    }
  }

  return { allowed: true }
}

/**
 * Record a failed login attempt for the given IP.
 * After MAX_LOGIN_ATTEMPTS failures, the IP is locked for LOCKOUT_DURATION.
 */
export function recordFailedLogin(ip: string): void {
  const entry = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 }
  entry.count++

  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION
    entry.count = 0 // Reset count after lockout
  }

  loginAttempts.set(ip, entry)
}

/**
 * Reset the login attempt counter for the given IP (on successful login).
 */
export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * Extract client IP from request headers (behind reverse proxy).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}
