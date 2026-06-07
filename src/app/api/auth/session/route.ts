import { NextResponse } from 'next/server'
import { getSession } from '@/lib/kv-data'

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('enkutatash_session')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    // Look up session directly by token in KV
    const session = await getSession(token)

    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('[Auth Session] Error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
