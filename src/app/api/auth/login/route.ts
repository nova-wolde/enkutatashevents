import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import {
  timingSafePasswordCompare,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  getClientIp,
} from '@/lib/auth-helpers'

const DATA_DIR = path.join(process.cwd(), 'data')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')
const OWNER_PASSWORD = process.env.OWNER_PASSWORD

interface Session {
  token: string
  createdAt: string
  expiresAt: string
}

async function getSessions(): Promise<Session[]> {
  if (!existsSync(SESSIONS_FILE)) return []
  try {
    const raw = await readFile(SESSIONS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveSessions(sessions: Session[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8')
}

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

    // Clean expired sessions and save
    const sessions = await getSessions()
    const activeSessions = sessions.filter(s => new Date(s.expiresAt) > now)
    activeSessions.push(session)
    await saveSessions(activeSessions)

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
