// ─────────────────────────────────────────────────────────────
// ALMARI — Affiliate Link Generator
// Maps style gaps → real product search URLs with tracking
// ─────────────────────────────────────────────────────────────

// Add your affiliate IDs here after signing up
const MYNTRA_AFF_ID  = process.env.MYNTRA_AFFILIATE_ID  ?? ''
const AMAZON_AFF_TAG = process.env.AMAZON_AFFILIATE_TAG ?? ''

export type AffiliateProvider = 'myntra' | 'amazon'

export interface AffiliateLink {
  url: string
  provider: AffiliateProvider
  query: string
}

// ── Gap type → search query mapping ───────────────────────────

const FORMALITY_FOOTWEAR: Record<number, string> = {
  1: 'white sneakers',
  2: 'casual sneakers loafers',
  3: 'loafers slip on shoes',
  4: 'formal loafers oxford shoes',
  5: 'formal shoes leather oxford',
}

const FORMALITY_LAYER: Record<number, string> = {
  1: 'hoodie sweatshirt',
  2: 'denim jacket casual',
  3: 'cardigan blazer smart casual',
  4: 'formal blazer structured',
  5: 'suit blazer formal',
}

const FORMALITY_ACCESSORY: Record<number, string> = {
  1: 'casual watch bracelet',
  2: 'casual belt sling bag',
  3: 'leather belt watch sling bag',
  4: 'leather belt structured bag watch',
  5: 'leather belt formal bag watch',
}

function buildSearchQuery(
  gapType: string,
  colorSuggestions: string[],
  formality: number,
  gapCategory: string,
): string {
  const f = Math.max(1, Math.min(5, formality || 3))
  const colorHint = colorSuggestions.slice(0, 2).join(' ')

  switch (gapType) {
    case 'missing-footwear':
      return `${colorHint} ${FORMALITY_FOOTWEAR[f] ?? 'shoes'}`
    case 'missing-layer':
      return `${colorHint} ${FORMALITY_LAYER[f] ?? 'jacket'}`
    case 'missing-accessory':
      return `${colorHint} ${FORMALITY_ACCESSORY[f] ?? 'belt watch'}`
    case 'missing-bottom':
      return `${colorHint} ${f <= 2 ? 'jeans trousers' : 'trousers chinos'}`
    case 'missing-top':
      return `${colorHint} ${f <= 2 ? 'shirt t-shirt' : 'formal shirt'}`
    case 'color-needs-anchor':
      return `${colorSuggestions[0] ?? 'terracotta'} ${gapCategory} clothing`
    case 'color-needs-neutral':
      return `white black navy ${gapCategory} solid clothing`
    case 'pattern-overload':
      return `solid plain ${colorSuggestions[0] ?? 'white'} ${gapCategory}`
    default:
      return `${colorHint} ${gapCategory} clothing`
  }
}

// ── Provider selection ─────────────────────────────────────────
// Accessories → Amazon (better selection for watches, belts, bags)
// Everything else → Myntra (better for Indian fashion)

function pickProvider(gapCategory: string): AffiliateProvider {
  if (['accessory', 'dupatta'].includes(gapCategory)) return 'amazon'
  return 'myntra'
}

// ── Myntra URL builder ─────────────────────────────────────────

const MYNTRA_CATEGORY_MAP: Record<string, string> = {
  top:       'topwear',
  bottom:    'bottomwear',
  outerwear: 'topwear',
  footwear:  'footwear',
  accessory: 'accessories',
  dupatta:   'accessories',
  'full-body': 'kurtas-and-suits',
}

function myntraUrl(query: string, gapCategory: string): string {
  const cat = MYNTRA_CATEGORY_MAP[gapCategory] ?? 'fashion'
  const params = new URLSearchParams({ rawQuery: query.trim() })
  const base = `https://www.myntra.com/${cat}?${params.toString()}`
  return MYNTRA_AFF_ID ? `${base}&ref=almari_${MYNTRA_AFF_ID}` : base
}

// ── Amazon URL builder ─────────────────────────────────────────

function amazonUrl(query: string): string {
  const params = new URLSearchParams({ k: query.trim(), i: 'fashion' })
  if (AMAZON_AFF_TAG) params.set('tag', AMAZON_AFF_TAG)
  return `https://www.amazon.in/s?${params.toString()}`
}

// ── Public: build affiliate link for a gap ────────────────────

export function buildAffiliateLink(
  gapType: string,
  gapCategory: string,
  colorSuggestions: string[],
  formality: number,
): AffiliateLink {
  const provider = pickProvider(gapCategory)
  const query    = buildSearchQuery(gapType, colorSuggestions, formality, gapCategory)
  const url      = provider === 'myntra'
    ? myntraUrl(query, gapCategory)
    : amazonUrl(query)

  return { url, provider, query }
}
