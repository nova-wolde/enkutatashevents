import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')

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
    const token = request.cookies.get('enkutatash_session')?.value

    if (token) {
      // Remove this session
      const sessions = await getSessions()
      const filtered = sessions.filter(s => s.token !== token)
      await saveSessions(filtered)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('enkutatash_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Auth Logout] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
