'use client'

const AMAZON_TAG = 'almari91-21'

const GAP_QUERIES: Record<string, Record<number, string>> = {
  'missing-footwear': {
    1: 'white sneakers casual shoes', 2: 'casual sneakers loafers',
    3: 'loafers slip on shoes men women', 4: 'formal loafers leather shoes',
    5: 'formal oxford leather shoes',
  },
  'missing-layer': {
    1: 'hoodie sweatshirt casual', 2: 'denim jacket casual outerwear',
    3: 'cardigan blazer smart casual', 4: 'formal blazer jacket',
    5: 'formal blazer suit jacket',
  },
  'missing-accessory': {
    1: 'casual watch bracelet', 2: 'casual belt bag',
    3: 'leather belt sling bag watch', 4: 'leather belt structured bag',
    5: 'formal leather belt watch',
  },
  'missing-bottom': {
    1: 'track pants joggers', 2: 'jeans casual trousers',
    3: 'chinos trousers smart', 4: 'formal trousers',
    5: 'formal trousers dress pants',
  },
  'missing-top': {
    1: 't-shirt casual top', 2: 'shirt casual top',
    3: 'formal shirt collar', 4: 'formal shirt office',
    5: 'formal dress shirt',
  },
  'color-needs-anchor': {
    3: 'terracotta mustard teal clothing top',
  },
  'color-needs-neutral': {
    3: 'white black navy solid plain clothing',
  },
  'pattern-overload': {
    3: 'solid plain white black clothing top',
  },
}

function buildQuery(
  gapType: string,
  category: string,
  colors: string[],
  formality: number,
): string {
  const f = Math.max(1, Math.min(5, formality || 3)) as 1 | 2 | 3 | 4 | 5
  const colorHint = colors.slice(0, 2).join(' ')
  const queries = GAP_QUERIES[gapType]
  const base = queries?.[f] ?? queries?.[3] ?? `${category} clothing`
  return `${colorHint} ${base}`.trim()
}

interface Props {
  gapType: string
  category: string
  colorSuggestions: string[]
  formality?: number
  style?: React.CSSProperties
  className?: string
}

export default function ShopGapButton({
  gapType, category, colorSuggestions, formality = 3, style, className,
}: Props) {
  const query = buildQuery(gapType, category, colorSuggestions, formality)
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: 'block',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 12,
        padding: '10px',
        borderRadius: 10,
        color: 'white',
        textDecoration: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      shop this gap →
    </a>
  )
}
