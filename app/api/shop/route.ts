import { NextRequest, NextResponse } from 'next/server'
import { buildAffiliateLink } from '@/lib/affiliate'

const MYNTRA_CATEGORY: Record<string, string> = {
  top: 'topwear', bottom: 'bottomwear', outerwear: 'topwear',
  footwear: 'footwear', accessory: 'accessories',
  dupatta: 'accessories', 'full-body': 'kurtas-and-suits',
}

export async function GET(req: NextRequest) {
  const p         = req.nextUrl.searchParams
  const gapType   = p.get('gap')      ?? 'missing-accessory'
  const category  = p.get('category') ?? 'accessory'
  const colors    = (p.get('colors') ?? '').split(',').filter(Boolean)
  const formality = Number(p.get('formality') ?? '3')

  const { query } = buildAffiliateLink(gapType, category, colors, formality)
  const q = encodeURIComponent(query)
  const cat = MYNTRA_CATEGORY[category] ?? 'fashion'

  const platforms = [
    {
      name: 'Amazon India',
      color: '#FF9900',
      letter: 'a',
      badge: 'best price',
      delivery: 'prime delivery · almari affiliate',
      why: 'largest selection · filtered to your price range',
      url: `https://www.amazon.in/s?k=${q}&i=fashion&tag=almari91-21`,
    },
    {
      name: 'Myntra',
      color: '#FF3F6C',
      letter: 'M',
      badge: null,
      delivery: 'Indian brands · fast delivery',
      why: 'HRX, Roadster, U.S. Polo Assn — strong mid-range',
      url: `https://www.myntra.com/${cat}?rawQuery=${q}`,
    },
    {
      name: 'Ajio',
      color: '#F26522',
      letter: 'A',
      badge: null,
      delivery: 'Reliance · value picks',
      why: 'good options at the lower end of the range',
      url: `https://www.ajio.com/search/?text=${q}`,
    },
  ]

  return NextResponse.json({ query, gapType, category, platforms })
}
