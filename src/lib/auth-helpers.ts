/**
 * Shared authentication helpers for API routes.
 *
 * - verifyAuth():   Verify session cookie → return authenticated boolean
 * - timingSafeEqual(): Compare passwords in constant time (Web Crypto API)
 * - Login rate limiting (Upstash Redis-backed, works across Workers isolates)
 */

import { getSession } from "@/lib/kv-data"
import { Redis } from "@upstash/redis"

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
// Uses Redis for persistent rate limiting across Cloudflare Workers isolates.
// Falls back to permissive (no limiting) if Redis is not configured.

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 // 15 minutes in seconds

let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (_redis !== null) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}

/**
 * Check if the IP is currently locked out from login attempts.
 * Uses Redis key `login_attempts:<ip>` with atomic INCR + TTL.
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }
 */
export async function checkLoginRateLimit(ip: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const redis = getRedis()
  if (!redis) {
    // No Redis configured — allow all requests (development fallback)
    return { allowed: true }
  }

  try {
    const key = `login_attempts:${ip}`

    // Check if currently locked out
    const lockKey = `login_locked:${ip}`
    const lockedTtl = await redis.ttl(lockKey)
    if (lockedTtl > 0) {
      return { allowed: false, retryAfterMs: lockedTtl * 1000 }
    }

    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

/**
 * Record a failed login attempt for the given IP.
 * After MAX_LOGIN_ATTEMPTS failures, the IP is locked for LOCKOUT_DURATION.
 * Uses Redis atomic operations for consistency across Workers isolates.
 */
export async function recordFailedLogin(ip: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    const key = `login_attempts:${ip}`

    // Atomically increment the attempt counter
    const count = await redis.incr(key)

    if (count === 1) {
      // First attempt — set a 15-minute window TTL
      await redis.expire(key, LOCKOUT_DURATION)
    }

    if (count >= MAX_LOGIN_ATTEMPTS) {
      // Too many attempts — lock the IP
      const lockKey = `login_locked:${ip}`
      await redis.set(lockKey, "1", { ex: LOCKOUT_DURATION })
      // Reset the attempt counter
      await redis.del(key)
    }
  } catch {
    // Silently fail — don't block login if Redis is down
  }
}

/**
 * Reset the login attempt counter for the given IP (on successful login).
 */
export async function resetLoginAttempts(ip: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    await redis.del(`login_attempts:${ip}`)
    await redis.del(`login_locked:${ip}`)
  } catch {
    // Silently fail
  }
}

/**
 * Extract client IP from request headers (behind reverse proxy).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
}
