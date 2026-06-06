import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
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

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('enkutatash_session')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const sessions = await getSessions()
    const session = sessions.find(s => s.token === token)

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('[Auth Session] Error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
