/**
 * Vercel KV Data Layer
 *
 * Replaces the JSON file-based storage with Vercel KV (Redis).
 * Each data collection is stored as a single JSON string under one key.
 * Sessions use individual keys with native Redis TTL for auto-expiry.
 */

import { kv } from "@vercel/kv"

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

/** Get a parsed JSON value from KV, or return null */
async function getKV<T>(key: string): Promise<T | null> {
  try {
    const raw = await kv.get<T>(key)
    return raw
  } catch (error) {
    console.error(`[KV] Error reading key "${key}":`, error)
    return null
  }
}

/** Set a JSON value in KV */
async function setKV<T>(key: string, value: T): Promise<void> {
  try {
    await kv.set(key, value)
  } catch (error) {
    console.error(`[KV] Error writing key "${key}":`, error)
    throw error
  }
}

// ─── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Record<string, unknown>[]> {
  const events = await getKV<Record<string, unknown>[]>(KEYS.events)
  return events ?? []
}

export async function saveEvents(events: Record<string, unknown>[]): Promise<void> {
  await setKV(KEYS.events, events)
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

export async function getBookings(): Promise<Booking[]> {
  const bookings = await getKV<Booking[]>(KEYS.bookings)
  return bookings ?? []
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  await setKV(KEYS.bookings, bookings)
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

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await getKV<ContactSubmission[]>(KEYS.contactSubmissions)
  return submissions ?? []
}

export async function saveContactSubmissions(submissions: ContactSubmission[]): Promise<void> {
  await setKV(KEYS.contactSubmissions, submissions)
}

// ─── Site Content ──────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  return await getKV<Record<string, unknown>>(KEYS.siteContent)
}

export async function saveSiteContent(content: Record<string, unknown>): Promise<void> {
  await setKV(KEYS.siteContent, content)
}

// ─── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Record<string, unknown>[]> {
  const activities = await getKV<Record<string, unknown>[]>(KEYS.activities)
  return activities ?? []
}

export async function saveActivities(activities: Record<string, unknown>[]): Promise<void> {
  await setKV(KEYS.activities, activities)
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
 * Redis will auto-delete the key after the TTL expires.
 */
export async function createSession(session: Session): Promise<void> {
  const key = `${KEYS.sessionPrefix}${session.token}`
  await kv.set(key, JSON.stringify(session), { ex: SESSION_TTL_SECONDS })
}

/**
 * Get a session by token. Returns null if not found or expired.
 * (KV auto-expires via TTL, so we don't need to manually check expiry,
 *  but we double-check just in case of clock skew.)
 */
export async function getSession(token: string): Promise<Session | null> {
  const key = `${KEYS.sessionPrefix}${token}`
  const raw = await kv.get<string>(key)
  if (!raw) return null

  try {
    const session: Session = typeof raw === "string" ? JSON.parse(raw) : raw
    // Double-check expiry (belt-and-suspenders; KV TTL should handle this)
    if (new Date(session.expiresAt) < new Date()) {
      await kv.del(key)
      return null
    }
    return session
  } catch {
    return null
  }
}

/**
 * Delete a session by token (used for logout).
 */
export async function deleteSession(token: string): Promise<void> {
  const key = `${KEYS.sessionPrefix}${token}`
  await kv.del(key)
}

// ─── Health Check ──────────────────────────────────────────────────────────────

/**
 * Check if KV is reachable by performing a ping.
 */
export async function checkKVHealth(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now()
  try {
    // Try a simple get operation on a non-existent key
    await kv.get("__health_check__")
    return { ok: true, latencyMs: Date.now() - start }
  } catch {
    return { ok: false, latencyMs: Date.now() - start }
  }
}

/**
 * Check which data keys exist in KV.
 */
export async function checkDataKeys(): Promise<Record<string, boolean>> {
  const keys = [KEYS.siteContent, KEYS.events, KEYS.bookings, KEYS.contactSubmissions, KEYS.activities]
  const results: Record<string, boolean> = {}

  await Promise.all(
    keys.map(async (key) => {
      const val = await kv.get(key)
      results[key] = val !== null
    })
  )

  return results
}
