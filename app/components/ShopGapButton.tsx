'use client'

const SF = "system-ui, -apple-system, sans-serif"

interface Props {
  gapType: string
  category: string
  colorSuggestions: string[]
  formality?: number
  itemName?: string
  style?: React.CSSProperties
  className?: string
}

export default function ShopGapButton({
  gapType, category, colorSuggestions, formality = 3, itemName, style, className,
}: Props) {
  const colors = colorSuggestions.slice(0, 3).join(',')
  const item   = itemName ? encodeURIComponent(itemName) : ''
  const href   = `/shop?gap=${encodeURIComponent(gapType)}&category=${encodeURIComponent(category)}&colors=${encodeURIComponent(colors)}&formality=${formality}${item ? `&item=${item}` : ''}`

  return (
    <a
      href={href}
      className={className}
      style={{
        display: 'block',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 12,
        fontFamily: SF,
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
