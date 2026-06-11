'use client'

interface Props {
  gapType: string
  category: string
  colorSuggestions: string[]
  formality?: number
  style?: React.CSSProperties
  className?: string
}

export default function ShopGapButton({
  gapType,
  category,
  colorSuggestions,
  formality = 3,
  style,
  className,
}: Props) {
  const colors = colorSuggestions.slice(0, 3).join(',')
  const href = `/api/shop?gap=${encodeURIComponent(gapType)}&category=${encodeURIComponent(category)}&colors=${encodeURIComponent(colors)}&formality=${formality}`

  return (
    <a
      href={href}
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
