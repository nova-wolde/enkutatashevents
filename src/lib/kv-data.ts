/**
 * Meowdis Redis Data Layer
 *
 * Uses Meowdis (Redis-compatible Durable Object) running on Cloudflare Workers.
 * Deployed as a separate Worker with a service binding. Falls back to direct
 * HTTP fetch when the binding isn't available (e.g., local dev).
 *
 * IMPORTANT: If neither binding nor URL is configured, all read operations
 * return null and writes are no-ops. API routes fall back to seed data.
 */

import { meowdis } from "./meowdis-client"

// ─── Availability Check ────────────────────────────────────────────────────────
let redisAvailable: boolean | null = null
let redisAvailableAt: number = 0
const REDIS_CACHE_TTL = 30_000 // re-check every 30 seconds after a failure

async function isRedisAvailable(): Promise<boolean> {
  if (redisAvailable === true) return true
  if (redisAvailable === false && Date.now() - redisAvailableAt < REDIS_CACHE_TTL) return false

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("[Redis] No UPSTASH_REDIS_REST_URL found. Redis is not configured.")
    redisAvailable = false
    redisAvailableAt = Date.now()
    return false
  }

  try {
    await meowdis.get("__redis_health_check__")
    redisAvailable = true
    redisAvailableAt = Date.now()
    return true
  } catch (error) {
    console.warn("[Redis] Health check failed. Redis may not be reachable:", error)
    redisAvailable = false
    redisAvailableAt = Date.now()
    return false
  }
}

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
    const raw = await meowdis.get<T>(key)
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
    await meowdis.set(key, value)
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

// ─── Site Content (with in-memory cache) ────────────────────────────────────────
let _siteContentCache: { data: Record<string, unknown>; expiresAt: number } | null = null
const SITE_CONTENT_CACHE_TTL = 60_000 // 60 seconds

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  if (_siteContentCache && Date.now() < _siteContentCache.expiresAt) {
    return _siteContentCache.data
  }
  const data = await getRedisValue<Record<string, unknown>>(KEYS.siteContent)
  if (data) {
    _siteContentCache = { data, expiresAt: Date.now() + SITE_CONTENT_CACHE_TTL }
  }
  return data
}

export async function saveSiteContent(content: Record<string, unknown>): Promise<boolean> {
  _siteContentCache = null
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

export async function createSession(session: Session): Promise<boolean> {
  if (!(await isRedisAvailable())) {
    console.warn("[Redis] Cannot create session — Redis is not available.")
    return false
  }
  try {
    const key = `${KEYS.sessionPrefix}${session.token}`
    await meowdis.set(key, JSON.stringify(session), { ex: SESSION_TTL_SECONDS })
    return true
  } catch (error) {
    console.error("[Redis] Error creating session:", error)
    return false
  }
}

export async function getSession(token: string): Promise<Session | null> {
  if (!(await isRedisAvailable())) return null
  try {
    const key = `${KEYS.sessionPrefix}${token}`
    const raw = await meowdis.get<string>(key)
    if (!raw) return null

    const session: Session = typeof raw === "string" ? JSON.parse(raw) : raw
    if (new Date(session.expiresAt) < new Date()) {
      await meowdis.del(key)
      return null
    }
    return session
  } catch (error) {
    console.error("[Redis] Error getting session:", error)
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  if (!(await isRedisAvailable())) return
  try {
    const key = `${KEYS.sessionPrefix}${token}`
    await meowdis.del(key)
  } catch (error) {
    console.error("[Redis] Error deleting session:", error)
  }
}

// ─── Health Check ──────────────────────────────────────────────────────────────

export async function checkRedisHealth(): Promise<{ ok: boolean; latencyMs: number; configured: boolean; error?: string }> {
  const start = Date.now()

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { ok: false, latencyMs: Date.now() - start, configured: false }
  }

  try {
    await meowdis.get("__health_check__")
    return { ok: true, latencyMs: Date.now() - start, configured: true }
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start, configured: true, error: err instanceof Error ? err.message : String(err) }
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

  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = await meowdis.get(key)
        results[key] = val !== null
      } catch {
        results[key] = false
      }
    })
  )

  return results
}
