import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helpers'
import { getBookings, saveBookings, type Booking } from '@/lib/kv-data'

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

    const bookings = (await getBookings()) || []
    bookings.unshift(booking)
    const saved = await saveBookings(bookings)
    if (!saved) {
      return NextResponse.json(
        { success: false, errors: ['Failed to save booking — KV store may not be configured. Please set up Vercel KV.'] },
        { status: 503 }
      )
    }

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
    const bookings = (await getBookings()) || []
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
    const { id, status, read, checkedIn } = body as { id: string; status?: string; read?: boolean; checkedIn?: boolean }

    const bookings = (await getBookings()) || []
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

    if (checkedIn !== undefined) {
      bookings[index].checkedIn = checkedIn
    }

    const saved = await saveBookings(bookings)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ['Failed to save — KV store may not be configured.'] }, { status: 503 })
    }
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

    const bookings = (await getBookings()) || []
    const filtered = bookings.filter((b) => b.id !== id)
    const saved = await saveBookings(filtered)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ['Failed to save — KV store may not be configured.'] }, { status: 503 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Failed to delete'] },
      { status: 500 }
    )
  }
}
