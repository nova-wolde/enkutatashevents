/**
 * Vercel KV Data Layer
 *
 * Replaces the JSON file-based storage with Vercel KV (Redis).
 * Each data collection is stored as a single JSON string under one key.
 * Sessions use individual keys with native Redis TTL for auto-expiry.
 *
 * IMPORTANT: If KV is not configured (no KV_REST_API_URL env var),
 * all read operations return null and writes are no-ops.
 * API routes should fall back to seed data when reads return null.
 */

import { kv } from "@vercel/kv"

// ─── KV Availability Check ────────────────────────────────────────────────────
let kvAvailable: boolean | null = null

/**
 * Check if Vercel KV is configured and reachable.
 * Caches the result so we don't check on every request.
 */
async function isKVAvailable(): Promise<boolean> {
  if (kvAvailable !== null) return kvAvailable

  // Quick check: if the env vars aren't set, KV is definitely not available
  if (!process.env.KV_REST_API_URL && !process.env.KV_URL) {
    console.warn("[KV] No KV environment variables found. KV is not configured.")
    kvAvailable = false
    return false
  }

  // Try a simple operation to verify connectivity
  try {
    await kv.get("__kv_health_check__")
    kvAvailable = true
    return true
  } catch (error) {
    console.warn("[KV] KV health check failed. KV may not be linked yet:", error)
    kvAvailable = false
    return false
  }
}

/**
 * Reset the KV availability cache (useful after linking KV store).
 */
export function resetKVAvailability(): void {
  kvAvailable = null
}

// ─── KV Key Constants ──────────────────────────────────────────────────────────
const KEYS = {
  events: "data:events",
  bookings: "data:bookings",
  contactSubmissions: "data:contact-submissions",
  siteContent: "data:site-content",
  activities: "data:activities",
  sessionPrefix: "session:",
} as const

// ─── Generic Helpers ───────────────────────────────────────────────────────────

/** Get a parsed JSON value from KV, or return null. Returns null if KV is unavailable. */
async function getKV<T>(key: string): Promise<T | null> {
  if (!(await isKVAvailable())) return null
  try {
    const raw = await kv.get<T>(key)
    return raw
  } catch (error) {
    console.error(`[KV] Error reading key "${key}":`, error)
    return null
  }
}

/** Set a JSON value in KV. No-op if KV is unavailable. */
async function setKV<T>(key: string, value: T): Promise<boolean> {
  if (!(await isKVAvailable())) {
    console.warn(`[KV] Cannot write key "${key}" — KV is not available.`)
    return false
  }
  try {
    await kv.set(key, value)
    return true
  } catch (error) {
    console.error(`[KV] Error writing key "${key}":`, error)
    return false
  }
}

// ─── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Record<string, unknown>[] | null> {
  return await getKV<Record<string, unknown>[]>(KEYS.events)
}

export async function saveEvents(events: Record<string, unknown>[]): Promise<boolean> {
  return await setKV(KEYS.events, events)
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
}

export async function getBookings(): Promise<Booking[] | null> {
  return await getKV<Booking[]>(KEYS.bookings)
}

export async function saveBookings(bookings: Booking[]): Promise<boolean> {
  return await setKV(KEYS.bookings, bookings)
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
  return await getKV<ContactSubmission[]>(KEYS.contactSubmissions)
}

export async function saveContactSubmissions(submissions: ContactSubmission[]): Promise<boolean> {
  return await setKV(KEYS.contactSubmissions, submissions)
}

// ─── Site Content ──────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  return await getKV<Record<string, unknown>>(KEYS.siteContent)
}

export async function saveSiteContent(content: Record<string, unknown>): Promise<boolean> {
  return await setKV(KEYS.siteContent, content)
}

// ─── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Record<string, unknown>[] | null> {
  return await getKV<Record<string, unknown>[]>(KEYS.activities)
}

export async function saveActivities(activities: Record<string, unknown>[]): Promise<boolean> {
  return await setKV(KEYS.activities, activities)
}

// ─── Sessions (with native KV TTL) ────────────────────────────────────────────

export interface Session {
  token: string
  createdAt: string
  expiresAt: string
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

/**
 * Create a new session in KV with automatic TTL expiry.
 * Returns false if KV is unavailable.
 */
export async function createSession(session: Session): Promise<boolean> {
  if (!(await isKVAvailable())) {
    console.warn("[KV] Cannot create session — KV is not available.")
    return false
  }
  try {
    const key = `${KEYS.sessionPrefix}${session.token}`
    await kv.set(key, JSON.stringify(session), { ex: SESSION_TTL_SECONDS })
    return true
  } catch (error) {
    console.error("[KV] Error creating session:", error)
    return false
  }
}

/**
 * Get a session by token. Returns null if not found, expired, or KV unavailable.
 */
export async function getSession(token: string): Promise<Session | null> {
  if (!(await isKVAvailable())) return null
  try {
    const key = `${KEYS.sessionPrefix}${token}`
    const raw = await kv.get<string>(key)
    if (!raw) return null

    const session: Session = typeof raw === "string" ? JSON.parse(raw) : raw
    // Double-check expiry
    if (new Date(session.expiresAt) < new Date()) {
      await kv.del(key)
      return null
    }
    return session
  } catch (error) {
    console.error("[KV] Error getting session:", error)
    return null
  }
}

/**
 * Delete a session by token (used for logout).
 */
export async function deleteSession(token: string): Promise<void> {
  if (!(await isKVAvailable())) return
  try {
    const key = `${KEYS.sessionPrefix}${token}`
    await kv.del(key)
  } catch (error) {
    console.error("[KV] Error deleting session:", error)
  }
}

// ─── Health Check ──────────────────────────────────────────────────────────────

/**
 * Check if KV is reachable.
 */
export async function checkKVHealth(): Promise<{ ok: boolean; latencyMs: number; configured: boolean }> {
  const start = Date.now()

  if (!process.env.KV_REST_API_URL && !process.env.KV_URL) {
    return { ok: false, latencyMs: Date.now() - start, configured: false }
  }

  try {
    await kv.get("__health_check__")
    return { ok: true, latencyMs: Date.now() - start, configured: true }
  } catch {
    return { ok: false, latencyMs: Date.now() - start, configured: true }
  }
}

/**
 * Check which data keys exist in KV.
 */
export async function checkDataKeys(): Promise<Record<string, boolean>> {
  if (!(await isKVAvailable())) {
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
        const val = await kv.get(key)
        results[key] = val !== null
      } catch {
        results[key] = false
      }
    })
  )

  return results
}
