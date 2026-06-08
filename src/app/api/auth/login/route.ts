import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  timingSafePasswordCompare,
  generateToken,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  getClientIp,
} from '@/lib/auth-helpers'
import { createSession } from '@/lib/kv-data'

const OWNER_PASSWORD = process.env.OWNER_PASSWORD

export async function POST(request: NextRequest) {
  try {
    // ── 1. Rate limiting check (Redis-backed, works across Workers isolates) ──
    const clientIp = getClientIp(request)
    const rateCheck = await checkLoginRateLimit(clientIp)

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

    // ── 3. Timing-safe password comparison (Web Crypto API) ─────────────────
    if (!OWNER_PASSWORD || !(await timingSafePasswordCompare(password, OWNER_PASSWORD))) {
      await recordFailedLogin(clientIp)
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // ── 4. Generate session token (Web Crypto API) ──────────────────────────
    const token = generateToken(32)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const session = {
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Save session to KV with TTL (Redis auto-expires after 7 days)
    const sessionCreated = await createSession(session)
    if (!sessionCreated) {
      return NextResponse.json(
        { success: false, error: 'Login failed — Upstash Redis is not configured. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your environment variables.' },
        { status: 503 }
      )
    }

    // Reset rate limit on successful login
    await resetLoginAttempts(clientIp)

    // ── 5. Set HTTP-only cookie ─────────────────────────────────────────────
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
    })

    response.cookies.set('enkutatash_session', token, {
      httpOnly: true,
      // On Cloudflare Workers, always use secure cookies (Cloudflare enforces HTTPS)
      secure: true,
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
