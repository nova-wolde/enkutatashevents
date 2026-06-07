import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  timingSafePasswordCompare,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  getClientIp,
} from '@/lib/auth-helpers'
import { createSession, type Session } from '@/lib/kv-data'

const OWNER_PASSWORD = process.env.OWNER_PASSWORD

export async function POST(request: Request) {
  try {
    // ── 1. Rate limiting check ──────────────────────────────────────────────
    const clientIp = getClientIp(request)
    const rateCheck = checkLoginRateLimit(clientIp)

    if (!rateCheck.allowed) {
      const retryMinutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000)
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Please try again in ${retryMinutes} minutes.` },
        { status: 429 }
      )
    }

    // ── 2. Parse & validate request ─────────────────────────────────────────
    const body = await request.json()
    const { password } = body as { password: string }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // ── 3. Timing-safe password comparison ──────────────────────────────────
    if (!OWNER_PASSWORD || !timingSafePasswordCompare(password, OWNER_PASSWORD)) {
      recordFailedLogin(clientIp)
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // ── 4. Generate session token ───────────────────────────────────────────
    const token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const session: Session = {
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Save session to KV with TTL (Redis auto-expires after 7 days)
    await createSession(session)

    // Reset rate limit on successful login
    resetLoginAttempts(clientIp)

    // ── 5. Set HTTP-only cookie ─────────────────────────────────────────────
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
    })

    response.cookies.set('enkutatash_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Auth Login] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
