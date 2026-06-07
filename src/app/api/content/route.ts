import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-helpers"
import { getSiteContent, saveSiteContent } from "@/lib/kv-data"
import { getSeedSiteContent } from "@/lib/seed-data"

// ─── GET: Fetch Site Content ──────────────────────────────────────────────────
export async function GET() {
  try {
    const content = await getSiteContent()
    if (!content) {
      // KV not configured or no data saved yet — return seed data
      // Don't try to save (would fail if KV not available)
      const seed = getSeedSiteContent()
      return NextResponse.json({ content: seed })
    }
    return NextResponse.json({ content })
  } catch (error) {
    console.error("[Content GET] Error:", error)
    // Always return seed data as fallback so the site never breaks
    const seed = getSeedSiteContent()
    return NextResponse.json({ content: seed })
  }
}

// ─── PUT: Replace Full Content (auth required) ────────────────────────────────
export async function PUT(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const content = body.content as Record<string, unknown>
    if (!content) {
      return NextResponse.json({ success: false, errors: ["Content is required"] }, { status: 400 })
    }
    const saved = await saveSiteContent(content)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured. Please set up Vercel KV in your dashboard."] }, { status: 503 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to save content"] }, { status: 500 })
  }
}

// ─── PATCH: Update Partial Content (auth required) ────────────────────────────
export async function PATCH(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const current = await getSiteContent()
    if (!current) {
      return NextResponse.json({ success: false, errors: ["No content found. Seed first or configure KV."] }, { status: 404 })
    }
    const updated = { ...current, ...body }
    const saved = await saveSiteContent(updated)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to save — KV store may not be configured."] }, { status: 503 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to update content"] }, { status: 500 })
  }
}

// ─── POST: Seed Content (auth required) ───────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request)
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 })
    }

    const body = await request.json()
    const force = body.force as boolean

    const existing = await getSiteContent()
    if (existing && !force) {
      return NextResponse.json({ success: false, message: "Content already exists. Use force=true to overwrite." }, { status: 409 })
    }

    const seed = getSeedSiteContent()
    const saved = await saveSiteContent(seed)
    if (!saved) {
      return NextResponse.json({ success: false, errors: ["Failed to seed — KV store may not be configured. Please set up Vercel KV in your dashboard."] }, { status: 503 })
    }
    return NextResponse.json({ success: true, message: "Content seeded successfully" })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to seed content"] }, { status: 500 })
  }
}
