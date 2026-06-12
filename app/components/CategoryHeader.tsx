// Shared component: CategoryHeader
// Brass bar · label · hairline rule · count
// Used on every category section across wardrobe, history, etc.

const SF = "system-ui, -apple-system, sans-serif"

interface Props {
  label: string
  count: number
}

export default function CategoryHeader({ label, count }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 13, background: 'var(--color-brass)', borderRadius: 2, flexShrink: 0 }}/>
      <span style={{ fontFamily: SF, fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,149,106,0.3)' }}/>
      <span style={{ fontFamily: SF, fontSize: 10, color: 'var(--color-text-faint)' }}>{count}</span>
    </div>
  )
}
