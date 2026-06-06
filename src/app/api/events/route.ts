import { NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// ─── Data File Path ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "events.json")

const gradients = [
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
  "from-cyan-400 to-sky-600",
  "from-lime-400 to-green-600",
  "from-fuchsia-400 to-purple-600",
  "from-teal-400 to-emerald-600",
  "from-orange-400 to-red-600",
  "from-indigo-400 to-violet-600",
]

// ─── Seed Data ────────────────────────────────────────────────────────────────
function getSeedEvents() {
  return [
    { id: "1", name: "Meskel Festival Celebration", date: "2026-09-27", time: "09:00", venue: "Meskel Square, Addis Ababa", attendees: 1200, maxAttendees: 2000, category: "Cultural", status: "upcoming", description: "A grand cultural celebration of Meskel featuring traditional music, bonfire ceremony, and Ethiopian heritage performances.", ticketPrice: 0, imageGradient: gradients[0] },
    { id: "2", name: "Addis Corporate Summit 2026", date: "2026-07-15", time: "08:30", venue: "Hyatt Regency Addis Ababa", attendees: 280, maxAttendees: 400, category: "Corporate", status: "upcoming", description: "A premium corporate gathering with keynote speakers from leading Ethiopian businesses, networking sessions, and VIP dinner.", ticketPrice: 5000, imageGradient: gradients[1] },
    { id: "3", name: "Abebe & Selamawit Wedding", date: "2026-08-10", time: "14:00", venue: "Sheraton Addis Grand Ballroom", attendees: 450, maxAttendees: 500, category: "Wedding", status: "upcoming", description: "A luxurious wedding ceremony and reception with traditional Ethiopian and modern decoration, live music, and premium catering.", ticketPrice: 0, imageGradient: gradients[2] },
    { id: "4", name: "Ethio Jazz Night", date: "2026-06-20", time: "19:00", venue: "African Jazz Village, Addis Ababa", attendees: 180, maxAttendees: 250, category: "Concert", status: "ongoing", description: "An evening of Ethio-jazz performances featuring renowned musicians, with premium sound and lighting setup.", ticketPrice: 1500, imageGradient: gradients[3] },
    { id: "5", name: "Diamond Club Symposium 2026", date: "2026-05-15", time: "09:00", venue: "Addis Ababa University Main Hall", attendees: 500, maxAttendees: 500, category: "Symposium", status: "completed", description: "The annual Diamond Club Symposia with academic presentations, panel discussions, and networking for scholars and professionals.", ticketPrice: 2000, imageGradient: gradients[4] },
    { id: "6", name: "National Day Celebration", date: "2026-09-12", time: "10:00", venue: "Millennium Hall, Addis Ababa", attendees: 3000, maxAttendees: 5000, category: "Government", status: "upcoming", description: "A formal government event celebrating the Ethiopian National Day with official ceremonies, cultural displays, and public festivities.", ticketPrice: 0, imageGradient: gradients[5] },
    { id: "7", name: "Teff & Coffee Cultural Festival", date: "2026-04-22", time: "11:00", venue: "Unity Park, Addis Ababa", attendees: 800, maxAttendees: 1000, category: "Cultural", status: "completed", description: "A vibrant cultural festival celebrating Ethiopian teff and coffee heritage with traditional food, coffee ceremonies, and live performances.", ticketPrice: 300, imageGradient: gradients[6] },
    { id: "8", name: "Tech Hub Launch Event", date: "2026-03-10", time: "15:00", venue: "ICT Park, Addis Ababa", attendees: 0, maxAttendees: 200, category: "Corporate", status: "cancelled", description: "Technology hub launch event has been postponed due to construction delays.", ticketPrice: 0, imageGradient: gradients[7] },
    { id: "9", name: "Ethiopian New Year Gala — Enkutatash 2019", date: "2026-09-11", time: "18:00", venue: "Sheraton Addis Grand Ballroom", attendees: 350, maxAttendees: 400, category: "Cultural", status: "upcoming", description: "An elegant Ethiopian New Year celebration featuring traditional music, cultural dances, gourmet Ethiopian cuisine, and a spectacular stage setup.", ticketPrice: 3500, imageGradient: gradients[8] },
    { id: "10", name: "Lemi Kuraa Sub-city Official Event", date: "2026-07-28", time: "09:30", venue: "Lemi Kuraa Sub-city Hall", attendees: 200, maxAttendees: 300, category: "Government", status: "upcoming", description: "An official government event for Lemi Kuraa Sub-city with formal seating, stage setup, and protocol-compliant decoration.", ticketPrice: 0, imageGradient: gradients[9] },
  ]
}

async function getEvents(): Promise<Record<string, unknown>[]> {
  if (!existsSync(DATA_FILE)) {
    // Auto-seed
    const seed = getSeedEvents()
    await saveEvents(seed)
    return seed
  }
  try {
    const raw = await readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveEvents(events: Record<string, unknown>[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  await writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8")
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ events: [] })
  }
}

// ─── POST: Create Event ───────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const events = await getEvents()
    const newEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...body,
    }
    events.unshift(newEvent)
    await saveEvents(events)
    return NextResponse.json({ success: true, event: newEvent })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to create event"] }, { status: 500 })
  }
}

// ─── PUT: Update Event ────────────────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const events = await getEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) {
      return NextResponse.json({ success: false, errors: ["Event not found"] }, { status: 404 })
    }
    events[index] = { ...events[index], ...updates }
    await saveEvents(events)
    return NextResponse.json({ success: true, event: events[index] })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to update event"] }, { status: 500 })
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    const events = await getEvents()
    const filtered = events.filter((e) => e.id !== id)
    await saveEvents(filtered)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to delete event"] }, { status: 500 })
  }
}
