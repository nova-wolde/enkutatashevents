import { NextResponse } from 'next/server'
import { getAdminSettings } from '@/lib/kv-data'

// ─── Public site integrations (GA4 / GSC / Meta Pixel) ───────────────────────
// Returns ONLY the three marketing IDs. These are not secrets — measurement IDs
// and verification codes are visible in every page's HTML by design. They are
// stored via the owner dashboard (Settings → Integrations) so they can be
// changed at runtime without a redeploy. Server-side env vars still work as a
// fallback and take priority when set.

const ENV_FALLBACK = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
}

function sanitizeId(value: unknown): string {
  if (typeof value !== 'string') return ''
  // Only allow characters that can legitimately appear in these IDs — this
  // endpoint's values end up inside inline <script> strings.
  return value.replace(/[^A-Za-z0-9_.\-]/g, '').slice(0, 64)
}

export async function GET() {
  try {
    const settings = await getAdminSettings()

    const gaMeasurementId =
      sanitizeId(settings?.gaMeasurementId) || ENV_FALLBACK.gaMeasurementId
    const gscVerification =
      sanitizeId(settings?.gscVerification) || ENV_FALLBACK.gscVerification
    const metaPixelId =
      sanitizeId(settings?.metaPixelId) || ENV_FALLBACK.metaPixelId

    return NextResponse.json(
      { gaMeasurementId, gscVerification, metaPixelId },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      }
    )
  } catch {
    // Redis unavailable — fall back to env vars only
    return NextResponse.json(ENV_FALLBACK)
  }
}
