export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import DeleteItemButton from './DeleteItemButton'
import BottomNav from '@/app/components/BottomNav'
import CategoryHeader from '@/app/components/CategoryHeader'
import AlmariPattern from '@/app/components/AlmariPattern'

const DEMO_USER = 'demo'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

const COLOR_HEX: Record<string, string> = {
  white:'#FAFAFA','off-white':'#F5F0E8',ivory:'#FFFFF0',cream:'#FFF8DC',
  black:'#1A1A1A',charcoal:'#36454F',graphite:'#474747',
  'grey-light':'#D3D3D3','grey-medium':'#9E9E9E','grey-dark':'#616161',
  navy:'#1B2A4A',camel:'#C19A6B',tan:'#D2B48C',beige:'#F5F0DC',
  khaki:'#C3B091',brown:'#8B5E3C',chocolate:'#5C3317',
  red:'#C0392B',crimson:'#DC143C',burgundy:'#800020',maroon:'#800000',
  coral:'#FF6B6B',terracotta:'#C26A4E',rust:'#B7410E',
  orange:'#E67E22',amber:'#FFBF00',yellow:'#F4D03F',mustard:'#DFAF2C',gold:'#D4AF37',
  olive:'#808000',green:'#27AE60',emerald:'#046307',sage:'#B2AC88',teal:'#008080',
  'blue-light':'#AED6F1','blue-sky':'#87CEEB','blue-royal':'#2255A4',indigo:'#3F51B5',
  pink:'#F48FB1',blush:'#F2C4CE',rose:'#E8A0BF','hot-pink':'#FF69B4',fuchsia:'#C2185B',
  purple:'#7B1FA2',lavender:'#E6E6FA',plum:'#4A0E4E',
  saffron:'#FF9933',marigold:'#FFA500',peacock:'#006994','rani-pink':'#E75480',
}

// Formality badge — color encodes meaning via --color-primary / --color-brass
function FormalityBadge({ level }: { level: number }) {
  const labels = ['','sport','casual','smart','semi','formal']
  const isBrass = level >= 3
  return (
    <span style={{
      fontSize: 7, fontWeight: 500, padding: '2px 5px', borderRadius: 4,
      fontFamily: SF,
      background: isBrass ? 'var(--color-brass)' : 'var(--color-primary)',
      color: isBrass ? 'var(--color-text)' : 'var(--color-ivory)',
    }}>
      {labels[level] ?? ''}
    </span>
  )
}

const CAT_ORDER = ['top','bottom','full-body','outerwear','footwear','accessory','dupatta']

export default async function WardrobePage() {
  const items = await prisma.wardrobeItem.findMany({
    where: { userId: DEMO_USER, isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  const byCategory = CAT_ORDER.reduce((acc, cat) => {
    const c = items.filter(i => i.category === cat)
    if (c.length > 0) acc[cat] = c
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div style={{ background: 'var(--color-ivory-warm)', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 80 }}>

      {/* compact header with carved motif — HeroBand (compact variant) */}
      <div style={{ background: 'var(--color-primary-deep)', padding: 'var(--s-3) var(--s-4)', position: 'relative', overflow: 'hidden' }}>
        <AlmariPattern opacity={0.18} height={52} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="almari-logo" style={{ fontSize: 18, color: 'var(--color-ivory-warm)' }}>almari</p>
            <p style={{ fontSize: 9, color: 'var(--color-brass)', marginTop: 2, fontFamily: SF }}>{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
          </div>
          <Link href="/upload" style={{ background: 'rgba(196,149,106,0.22)', border: '1px solid var(--color-brass)', borderRadius: 'var(--r-md)', padding: '6px 12px', color: 'var(--color-ivory-warm)', fontSize: 11, fontWeight: 500, fontFamily: SF, textDecoration: 'none', minHeight: 'var(--touch-min)', display: 'flex', alignItems: 'center' }}>
            + add
          </Link>
        </div>
      </div>

      {/* shelf ambient glow — the light inside the almari */}
      <div style={{ height: 4, background: 'rgba(255,200,100,0.18)' }}/>

      {/* content */}
      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px var(--s-8)', gap: 14, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--r-full)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
            </svg>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>your almari is empty</p>
          <p style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 12, color: 'var(--color-primary-mid)', lineHeight: 1.6 }}>every great wardrobe starts with a single piece.</p>
          <Link href="/upload" style={{ background: 'var(--color-primary)', color: 'var(--color-ivory)', fontSize: 13, fontWeight: 500, padding: '11px 24px', borderRadius: 'var(--r-md)', textDecoration: 'none' }}>
            add your first piece
          </Link>
        </div>
      ) : (
        <div style={{ padding: 'var(--s-3) var(--s-4) 0' }}>
          {Object.entries(byCategory).map(([category, catItems]) => (
            <div key={category} style={{ marginBottom: 'var(--s-6)' }}>
              <CategoryHeader label={category} count={catItems.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-2)' }}>
                {catItems.map(item => (
                  <div key={item.id} style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '0.5px solid rgba(196,149,106,0.28)', position: 'relative' }}>
                    {/* image area with shelf glow */}
                    <div style={{ height: 80, background: 'var(--color-ivory-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {/* shelf ambient glow at top */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(255,210,130,0.2)' }}/>
                      {item.photoUrl
                        ? <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <div style={{ width: 26, height: 26, borderRadius: 'var(--r-full)', background: COLOR_HEX[item.primaryColor] ?? 'var(--color-ivory-border)' }}/>
                      }
                      {/* formality badge — brass for smart/semi/formal, primary for casual/sport */}
                      <div style={{ position: 'absolute', top: 6, left: 6 }}>
                        <FormalityBadge level={item.formality} />
                      </div>
                    </div>
                    {/* nameplate */}
                    <div style={{ padding: '4px 7px 5px', background: 'var(--color-ivory-warm)', borderTop: '0.5px solid rgba(196,149,106,0.2)' }}>
                      <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.name}</p>
                    </div>
                    {/* delete — 44px touch target */}
                    <DeleteItemButton id={item.id} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="pieces" />
    </div>
  )
}
