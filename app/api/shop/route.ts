import { NextRequest, NextResponse } from 'next/server'
import { buildAffiliateLink } from '@/lib/affiliate'

// ── GET /api/shop?gap=missing-footwear&category=footwear&colors=tan,black&formality=3
// Logs the click and redirects to the affiliate URL
// ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const p          = req.nextUrl.searchParams
  const gapType    = p.get('gap')      ?? 'missing-accessory'
  const category   = p.get('category') ?? 'accessory'
  const colors     = (p.get('colors') ?? '').split(',').filter(Boolean)
  const formality  = Number(p.get('formality') ?? '3')

  const link = buildAffiliateLink(gapType, category, colors, formality)

  // Log the click (simple console for now — swap for analytics later)
  console.log('affiliate_click', {
    gapType, category, colors, formality,
    provider: link.provider,
    query: link.query,
    url: link.url,
    ts: new Date().toISOString(),
  })

  return NextResponse.redirect(link.url)
}
