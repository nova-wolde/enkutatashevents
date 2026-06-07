import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-helpers"
import { getEvents, saveEvents } from "@/lib/kv-data"
import { getSeedEvents } from "@/lib/seed-data"

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const events = await getEvents()
    if (!events || events.length === 0) {
      // KV not configured or no data — return seed data
      const seed = getSeedEvents()
      return NextResponse.json({ events: seed })
    }
    return NextResponse.json({ events })
  } catch {
    const seed = getSeedEvents()
    return NextResponse.json({ events: seed })
  }
}

// ─── POST: Create Event (auth required) ───────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const events = (await getEvents()) || []
    const newEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...body,
    }
    events.unshift(newEvent)
    const saved = await saveEvents(events)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured."] }, { status: 503 })
    }
    return NextResponse.json({ success: true, event: newEvent })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to create event"] }, { status: 500 })
  }
}

// ─── PUT: Update Event (auth required) ────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body
    const events = (await getEvents()) || []
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) {
      return NextResponse.json({ success: false, errors: ["Event not found"] }, { status: 404 })
    }
    events[index] = { ...events[index], ...updates }
    const saved = await saveEvents(events)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured."] }, { status: 503 })
    }
    return NextResponse.json({ success: true, event: events[index] })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to update event"] }, { status: 500 })
  }
}

// ─── DELETE (auth required) ───────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body
    const events = (await getEvents()) || []
    const filtered = events.filter((e) => e.id !== id)
    const saved = await saveEvents(filtered)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured."] }, { status: 503 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to delete event"] }, { status: 500 })
  }
}
