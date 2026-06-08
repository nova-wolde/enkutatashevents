import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { deleteSession } from '@/lib/kv-data'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('enkutatash_session')?.value

    if (token) {
      // Delete session from KV
      await deleteSession(token)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('enkutatash_session', '', {
      httpOnly: true,
      // On Cloudflare Workers, always use secure cookies (Cloudflare enforces HTTPS)
      secure: true,
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
