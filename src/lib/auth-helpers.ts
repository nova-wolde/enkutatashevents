/**
 * Shared authentication helpers for API routes.
 *
 * - verifyAuth():   Verify session cookie → return authenticated boolean
 * - timingSafeEqual(): Compare passwords in constant time
 * - Login rate limiting (in-memory, per IP)
 */

import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

// ─── Session Types ────────────────────────────────────────────────────────────
interface Session {
  token: string
  createdAt: string
  expiresAt: string
}

// ─── Session Helper ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")

async function getSessions(): Promise<Session[]> {
  if (!existsSync(SESSIONS_FILE)) return []
  try {
    const raw = await readFile(SESSIONS_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// ─── Verify Auth ──────────────────────────────────────────────────────────────
/**
 * Check if the request has a valid session cookie.
 * Returns { authenticated: true } or { authenticated: false }.
 */
export async function verifyAuth(request: Request): Promise<{ authenticated: boolean }> {
  try {
    const token = request.cookies.get("enkutatash_session")?.value
    if (!token) return { authenticated: false }

    const sessions = await getSessions()
    const session = sessions.find(s => s.token === token)
    if (!session) return { authenticated: false }

    if (new Date(session.expiresAt) < new Date()) return { authenticated: false }

    return { authenticated: true }
  } catch {
    return { authenticated: false }
  }
}

// ─── Timing-Safe Password Comparison ──────────────────────────────────────────
/**
 * Compare two strings in constant time to prevent timing attacks.
 * Both strings are hashed first so the comparison is always the same length.
 */
export function timingSafePasswordCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false
  if (a.length === 0 || b.length === 0) return false

  const hashA = crypto.createHash("sha256").update(a).digest()
  const hashB = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

// ─── Login Rate Limiting ──────────────────────────────────────────────────────
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
