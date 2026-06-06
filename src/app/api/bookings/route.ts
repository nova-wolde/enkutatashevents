import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyAuth } from '@/lib/auth-helpers'

// ─── Booking Type ──────────────────────────────────────────────────────────
interface Booking {
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  read: boolean
}

// ─── Data File Path ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'bookings.json')

async function getBookings(): Promise<Booking[]> {
  if (!existsSync(DATA_FILE)) return []
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveBookings(bookings: Booking[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  await writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8')
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateBody(body: Record<string, unknown>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  const name = body.name as string
  const email = body.email as string
  const eventType = body.eventType as string
  const eventDate = body.eventDate as string

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required')
  }
  if (!eventType || eventType.trim().length < 1) {
    errors.push('Event type is required')
  }
  if (!eventDate) {
    errors.push('Event date is required')
  }

  return { valid: errors.length === 0, errors }
}

// ─── POST: Create Booking ─────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { valid, errors } = validateBody(body)
    if (!valid) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const booking: Booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: ((body.phone as string) || '').trim(),
      eventType: (body.eventType as string).trim(),
      eventDate: (body.eventDate as string) || '',
      guestCount: Number(body.guestCount) || 0,
      venue: ((body.venue as string) || '').trim(),
      services: Array.isArray(body.services) ? body.services : [],
      message: ((body.message as string) || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      read: false,
    }

    const bookings = await getBookings()
    bookings.unshift(booking)
    await saveBookings(bookings)

    console.log(`[Bookings] New booking from ${booking.name} (${booking.eventType} on ${booking.eventDate})`)

    return NextResponse.json({
      success: true,
      message: 'Booking submitted successfully! We will contact you shortly.',
      bookingId: booking.id,
    })
  } catch (error) {
    console.error('[Bookings] Error creating booking:', error)
    return NextResponse.json(
      { success: false, errors: ['Something went wrong. Please try again later.'] },
      { status: 500 }
    )
  }
}

// ─── GET: Fetch Bookings (auth required) ──────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ bookings: [] }, { status: 401 })
    }
    const bookings = await getBookings()
    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json({ bookings: [] })
  }
}

// ─── PATCH: Update Booking Status / Read (auth required) ─────────────────────
export async function PATCH(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ['Unauthorized'] }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, read } = body as { id: string; status?: string; read?: boolean }

    const bookings = await getBookings()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, errors: ['Booking not found'] },
        { status: 404 }
      )
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, errors: ['Invalid status'] },
          { status: 400 }
        )
      }
      bookings[index].status = status as Booking['status']
    }

    if (read !== undefined) {
      bookings[index].read = read
    }

    await saveBookings(bookings)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Failed to update'] },
      { status: 500 }
    )
  }
}

// ─── DELETE: Remove Booking (auth required) ──────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ['Unauthorized'] }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body as { id: string }

    const bookings = await getBookings()
    const filtered = bookings.filter((b) => b.id !== id)
    await saveBookings(filtered)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Failed to delete'] },
      { status: 500 }
    )
  }
}
