// Shared component: AlmariPattern
// Block print SVG defined ONCE. Every hero references url(#almari-bp).
// Fixes the 6-copy duplication identified in the design system audit.

interface Props {
  opacity?: number
  height?: number
}

export default function AlmariPattern({ opacity = 0.1, height = 130 }: Props) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none' }}
      viewBox={`0 0 430 ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="almari-bp" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
          <g transform="translate(26,26)" fill="#F5F0E8">
            <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)"/>
            <rect x="-2" y="-17" width="4" height="11" rx="1.5"/>
            <rect x="-2" y="6"  width="4" height="11" rx="1.5"/>
            <rect x="-17" y="-2" width="11" height="4" rx="1.5"/>
            <rect x="6"  y="-2" width="11" height="4" rx="1.5"/>
            <g transform="rotate(45)">
              <rect x="-2" y="-14" width="4" height="8" rx="1.5"/>
              <rect x="-2" y="6"  width="4" height="8" rx="1.5"/>
              <rect x="-14" y="-2" width="8" height="4" rx="1.5"/>
              <rect x="6"  y="-2" width="8" height="4" rx="1.5"/>
            </g>
            <circle r="2.2" cx="-11" cy="-11"/>
            <circle r="2.2" cx="11"  cy="-11"/>
            <circle r="2.2" cx="-11" cy="11"/>
            <circle r="2.2" cx="11"  cy="11"/>
          </g>
        </pattern>
      </defs>
      <rect width="430" height={height} fill="url(#almari-bp)"/>
    </svg>
  )
}
