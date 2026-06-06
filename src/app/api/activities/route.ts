import { NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// ─── Data File Path ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "activities.json")

function getSeedActivities() {
  return [
    { id: "a1", user: "Kidane Tadesse", avatar: "KT", action: "submitted a booking for", target: "Wedding Reception", timestamp: "2026-06-05T00:00:00.000Z" },
    { id: "a2", user: "Enkutatash Team", avatar: "ET", action: "set up venue at", target: "Sheraton Addis", timestamp: "2026-06-04T22:00:00.000Z" },
    { id: "a3", user: "Meron Bekele", avatar: "MB", action: "confirmed booking for", target: "Corporate Summit", timestamp: "2026-06-04T20:00:00.000Z" },
    { id: "a4", user: "Yohannes Alemu", avatar: "YA", action: "sent a message about", target: "Concert Setup", timestamp: "2026-06-04T18:00:00.000Z" },
    { id: "a5", user: "Sara Girma", avatar: "SG", action: "booked catering for", target: "Meskel Festival", timestamp: "2026-06-04T16:00:00.000Z" },
    { id: "a6", user: "Enkutatash Team", avatar: "ET", action: "completed decoration for", target: "Diamond Club Symposium", timestamp: "2026-06-04T12:00:00.000Z" },
    { id: "a7", user: "Abebe Worku", avatar: "AW", action: "registered for", target: "Ethiopian New Year Gala", timestamp: "2026-06-03T00:00:00.000Z" },
    { id: "a8", user: "Helen Desta", avatar: "HD", action: "requested sound & light for", target: "Ethio Jazz Night", timestamp: "2026-06-02T12:00:00.000Z" },
  ]
}

async function getActivities(): Promise<Record<string, unknown>[]> {
  if (!existsSync(DATA_FILE)) {
    const seed = getSeedActivities()
    await saveActivities(seed)
    return seed
  }
  try {
    const raw = await readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveActivities(activities: Record<string, unknown>[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  await writeFile(DATA_FILE, JSON.stringify(activities, null, 2), "utf-8")
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const activities = await getActivities()
    return NextResponse.json({ activities })
  } catch {
    return NextResponse.json({ activities: [] })
  }
}

// ─── POST: Add Activity ───────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const activities = await getActivities()
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...body,
    }
    activities.unshift(newActivity)
    await saveActivities(activities)
    return NextResponse.json({ success: true, activity: newActivity })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to add activity"] }, { status: 500 })
  }
}
