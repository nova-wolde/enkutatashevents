import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-helpers"
import { getActivities, saveActivities } from "@/lib/kv-data"
import { getSeedActivities } from "@/lib/seed-data"

// ─── GET (auth required) ──────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ activities: [] }, { status: 401 })
    }
    const activities = await getActivities()
    if (!activities || activities.length === 0) {
      // KV not configured or no data — return seed data
      const seed = getSeedActivities()
      return NextResponse.json({ activities: seed })
    }
    return NextResponse.json({ activities })
  } catch {
    return NextResponse.json({ activities: [] })
  }
}

// ─── POST: Add Activity (auth required) ───────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const activities = (await getActivities()) || []
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...body,
    }
    activities.unshift(newActivity)
    const saved = await saveActivities(activities)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured."] }, { status: 503 })
    }
    return NextResponse.json({ success: true, activity: newActivity })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to add activity"] }, { status: 500 })
  }
}
