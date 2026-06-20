/**
 * Upstash Redis Data Layer
 *
 * Uses Upstash Redis (free, no credit card, with persistence!)
 * instead of Vercel KV. Same Redis commands, better free tier.
 *
 * IMPORTANT: If Upstash is not configured (no UPSTASH_REDIS_REST_URL env var),
 * all read operations return null and writes are no-ops.
 * API routes should fall back to seed data when reads return null.
 */

import { Redis } from "@upstash/redis"

// ─── Lazy Redis Client ────────────────────────────────────────────────────────
let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (_redis !== null) return _redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  _redis = new Redis({ url, token })
  return _redis
}

// ─── Availability Check ────────────────────────────────────────────────────────
let redisAvailable: boolean | null = null

/**
 * Check if Upstash Redis is configured and reachable.
 * Caches the result so we don't check on every request.
 */
async function isRedisAvailable(): Promise<boolean> {
  if (redisAvailable !== null) return redisAvailable

  const redis = getRedis()
  if (!redis) {
    console.warn("[Redis] No UPSTASH_REDIS_REST_URL found. Redis is not configured.")
    redisAvailable = false
    return false
  }

  // Try a simple operation to verify connectivity
  try {
    await redis.get("__redis_health_check__")
    redisAvailable = true
    return true
  } catch (error) {
    console.warn("[Redis] Health check failed. Redis may not be reachable:", error)
    redisAvailable = false
    return false
  }
}

/**
 * Reset the availability cache (useful after linking Redis).
 */
export function resetRedisAvailability(): void {
  redisAvailable = null
}

// ─── Key Constants ─────────────────────────────────────────────────────────────
const KEYS = {
  events: "data:events",
  bookings: "data:bookings",
  contactSubmissions: "data:contact-submissions",
  siteContent: "data:site-content",
  activities: "data:activities",
  sessionPrefix: "session:",
  adminSettings: "data:admin-settings",
  venues: "data:venues",
} as const

// ─── Generic Helpers ───────────────────────────────────────────────────────────

/** Get a parsed JSON value from Redis, or return null. */
async function getRedisValue<T>(key: string): Promise<T | null> {
  if (!(await isRedisAvailable())) return null
  try {
    const redis = getRedis()!
    const raw = await redis.get<T>(key)
    return raw
  } catch (error) {
    console.error(`[Redis] Error reading key "${key}":`, error)
    return null
  }
}

/** Set a JSON value in Redis. Returns true on success. */
async function setRedisValue<T>(key: string, value: T): Promise<boolean> {
  if (!(await isRedisAvailable())) {
    console.warn(`[Redis] Cannot write key "${key}" — Redis is not available.`)
    return false
  }
  try {
    const redis = getRedis()!
    await redis.set(key, value)
    return true
  } catch (error) {
    console.error(`[Redis] Error writing key "${key}":`, error)
    return false
  }
}

// ─── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Record<string, unknown>[] | null> {
  return await getRedisValue<Record<string, unknown>[]>(KEYS.events)
}

export async function saveEvents(events: Record<string, unknown>[]): Promise<boolean> {
  return await setRedisValue(KEYS.events, events)
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guestCount: number
  venue: string
  services: string[]
  message: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  read: boolean
  checkedIn?: boolean
}

export async function getBookings(): Promise<Booking[] | null> {
  return await getRedisValue<Booking[]>(KEYS.bookings)
}

export async function saveBookings(bookings: Booking[]): Promise<boolean> {
  return await setRedisValue(KEYS.bookings, bookings)
}

// ─── Contact Submissions ───────────────────────────────────────────────────────

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  eventType: string
  message: string
  createdAt: string
  read: boolean
}

export async function getContactSubmissions(): Promise<ContactSubmission[] | null> {
  return await getRedisValue<ContactSubmission[]>(KEYS.contactSubmissions)
}

export async function saveContactSubmissions(submissions: ContactSubmission[]): Promise<boolean> {
  return await setRedisValue(KEYS.contactSubmissions, submissions)
}

// ─── Site Content ──────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  return await getRedisValue<Record<string, unknown>>(KEYS.siteContent)
}

export async function saveSiteContent(content: Record<string, unknown>): Promise<boolean> {
  return await setRedisValue(KEYS.siteContent, content)
}

// ─── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Record<string, unknown>[] | null> {
  return await getRedisValue<Record<string, unknown>[]>(KEYS.activities)
}

export async function saveActivities(activities: Record<string, unknown>[]): Promise<boolean> {
  return await setRedisValue(KEYS.activities, activities)
}

// ─── Admin Settings ────────────────────────────────────────────────────────────

export interface AdminSettings {
  name: string
  email: string
  company: string
  emailNotif: boolean
  pushNotif: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  defaultVenue: string
  defaultCategory: string
  defaultMaxAttendees: string
}

export async function getAdminSettings(): Promise<AdminSettings | null> {
  return await getRedisValue<AdminSettings>(KEYS.adminSettings)
}

export async function saveAdminSettings(settings: AdminSettings): Promise<boolean> {
  return await setRedisValue(KEYS.adminSettings, settings)
}

// ─── Venues ────────────────────────────────────────────────────────────────────

export interface VenueRecord {
  name: string
  address: string
  capacity: number
  amenities: string[]
  status: 'Available' | 'Booked'
}

export async function getVenues(): Promise<VenueRecord[] | null> {
  return await getRedisValue<VenueRecord[]>(KEYS.venues)
}

export async function saveVenues(venues: VenueRecord[]): Promise<boolean> {
  return await setRedisValue(KEYS.venues, venues)
}

// ─── Sessions (with native Redis TTL) ─────────────────────────────────────────

export interface Session {
  token: string
  createdAt: string
  expiresAt: string
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

/**
 * Create a new session in Redis with automatic TTL expiry.
 */
export async function createSession(session: Session): Promise<boolean> {
  if (!(await isRedisAvailable())) {
    console.warn("[Redis] Cannot create session — Redis is not available.")
    return false
  }
  try {
    const redis = getRedis()!
    const key = `${KEYS.sessionPrefix}${session.token}`
    await redis.set(key, JSON.stringify(session), { ex: SESSION_TTL_SECONDS })
    return true
  } catch (error) {
    console.error("[Redis] Error creating session:", error)
    return false
  }
}

/**
 * Get a session by token. Returns null if not found, expired, or Redis unavailable.
 */
export async function getSession(token: string): Promise<Session | null> {
  if (!(await isRedisAvailable())) return null
  try {
    const redis = getRedis()!
    const key = `${KEYS.sessionPrefix}${token}`
    const raw = await redis.get<string>(key)
    if (!raw) return null

    const session: Session = typeof raw === "string" ? JSON.parse(raw) : raw
    // Double-check expiry (belt-and-suspenders; Redis TTL should handle this)
    if (new Date(session.expiresAt) < new Date()) {
      await redis.del(key)
      return null
    }
    return session
  } catch (error) {
    console.error("[Redis] Error getting session:", error)
    return null
  }
}

/**
 * Delete a session by token (used for logout).
 */
export async function deleteSession(token: string): Promise<void> {
  if (!(await isRedisAvailable())) return
  try {
    const redis = getRedis()!
    const key = `${KEYS.sessionPrefix}${token}`
    await redis.del(key)
  } catch (error) {
    console.error("[Redis] Error deleting session:", error)
  }
}

// ─── Health Check ──────────────────────────────────────────────────────────────

export async function checkRedisHealth(): Promise<{ ok: boolean; latencyMs: number; configured: boolean }> {
  const start = Date.now()

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { ok: false, latencyMs: Date.now() - start, configured: false }
  }

  try {
    const redis = getRedis()!
    await redis.get("__health_check__")
    return { ok: true, latencyMs: Date.now() - start, configured: true }
  } catch {
    return { ok: false, latencyMs: Date.now() - start, configured: true }
  }
}

/**
 * Check which data keys exist in Redis.
 */
export async function checkDataKeys(): Promise<Record<string, boolean>> {
  if (!(await isRedisAvailable())) {
    return {
      [KEYS.siteContent]: false,
      [KEYS.events]: false,
      [KEYS.bookings]: false,
      [KEYS.contactSubmissions]: false,
      [KEYS.activities]: false,
    }
  }

  const keys = [KEYS.siteContent, KEYS.events, KEYS.bookings, KEYS.contactSubmissions, KEYS.activities]
  const results: Record<string, boolean> = {}

  const redis = getRedis()!
  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = await redis.get(key)
        results[key] = val !== null
      } catch {
        results[key] = false
      }
    })
  )

  return results
}
