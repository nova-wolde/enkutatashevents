import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth-helpers"
import { getSiteContent, saveSiteContent } from "@/lib/kv-data"
import { getSeedSiteContent } from "@/lib/seed-data"

// ─── GET: Fetch Site Content ──────────────────────────────────────────────────
export async function GET() {
  try {
    let content = await getSiteContent()
    if (!content) {
      // Auto-seed on first request
      content = getSeedSiteContent()
      await saveSiteContent(content)
    }
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({ content: null }, { status: 500 })
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
    await saveSiteContent(content)
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
      return NextResponse.json({ success: false, errors: ["No content found. Seed first."] }, { status: 404 })
    }
    const updated = { ...current, ...body }
    await saveSiteContent(updated)
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
    await saveSiteContent(seed)
    return NextResponse.json({ success: true, message: "Content seeded successfully" })
  } catch {
    return NextResponse.json({ success: false, errors: ["Failed to seed content"] }, { status: 500 })
  }
}
