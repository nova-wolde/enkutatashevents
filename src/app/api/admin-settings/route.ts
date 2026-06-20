import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-helpers'
import { getAdminSettings, saveAdminSettings, type AdminSettings } from '@/lib/kv-data'

const DEFAULT_SETTINGS: AdminSettings = {
  name: 'Enkutatash Owner',
  email: 'enkutatashevents@gmail.com',
  company: 'Enkutatash Event',
  emailNotif: true,
  pushNotif: true,
  eventReminders: true,
  weeklyDigest: false,
  defaultVenue: '',
  defaultCategory: '',
  defaultMaxAttendees: '100',
}

// ─── GET: Fetch admin settings (auth required) ───────────────────────────────
export async function GET(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS }, { status: 401 })
    }
    const settings = await getAdminSettings()
    return NextResponse.json({ settings: settings ?? DEFAULT_SETTINGS })
  } catch {
    return NextResponse.json({ settings: DEFAULT_SETTINGS })
  }
}

// ─── PUT: Save admin settings (auth required) ────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ['Unauthorized'] }, { status: 401 })
    }
    const body = await request.json()
    const settings = body.settings as AdminSettings
    if (!settings) {
      return NextResponse.json({ success: false, errors: ['Settings payload required'] }, { status: 400 })
    }
    const saved = await saveAdminSettings(settings)
    if (!saved) {
      return NextResponse.json(
        { success: false, errors: ['Failed to save — KV store may not be configured.'] },
        { status: 503 }
      )
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ['Failed to save settings'] }, { status: 500 })
  }
}
