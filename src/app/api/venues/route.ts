import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helpers'
import { getVenues, saveVenues, type VenueRecord } from '@/lib/kv-data'

const DEFAULT_VENUES: VenueRecord[] = [
  { name: 'Sheraton Addis', address: 'Taitu St, Addis Ababa', capacity: 500, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering'], status: 'Available' },
  { name: 'Skylight Hotel', address: 'Bole Rd, Addis Ababa', capacity: 300, amenities: ['WiFi', 'Parking', 'AV Equipment'], status: 'Available' },
  { name: 'Hilton Addis Ababa', address: 'Menelik II Ave, Addis Ababa', capacity: 800, amenities: ['WiFi', 'Parking', 'AV Equipment', 'Catering', 'Stage'], status: 'Available' },
]

// ─── GET: Fetch venues (auth required) ───────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ venues: DEFAULT_VENUES }, { status: 401 })
    }
    const venues = await getVenues()
    return NextResponse.json({ venues: venues ?? DEFAULT_VENUES })
  } catch {
    return NextResponse.json({ venues: DEFAULT_VENUES })
  }
}

// ─── PUT: Save venues list (auth required) ───────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ['Unauthorized'] }, { status: 401 })
    }
    const body = await request.json()
    const venues = body.venues as VenueRecord[]
    if (!venues || !Array.isArray(venues)) {
      return NextResponse.json({ success: false, errors: ['venues array required'] }, { status: 400 })
    }
    const saved = await saveVenues(venues)
    if (!saved) {
      return NextResponse.json(
        { success: false, errors: ['Failed to save — KV store may not be configured.'] },
        { status: 503 }
      )
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ['Failed to save venues'] }, { status: 500 })
  }
}
