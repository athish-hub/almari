export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import DeleteItemButton from './DeleteItemButton'
import BottomNav from '@/app/components/BottomNav'

const DEMO_USER = 'demo'
const M = '#7B3030'
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
    <div style={{ background: '#F5F0E8', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 80 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '42px 20px 20px' }}>
        <div>
          <span style={{ fontFamily: PF, fontSize: 20, fontWeight: 400, letterSpacing: 5, color: M, textTransform: 'lowercase' as const }}>almari</span>
          <p style={{ fontSize: 10, color: '#7A7068', marginTop: 3 }}>{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
        </div>
        <Link href="/upload" style={{ textDecoration: 'none', background: M, color: '#F5F0E8', fontFamily: SF, fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          add
        </Link>
      </div>

      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#F2E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" fill="none" stroke={M} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
          </div>
          <p style={{ fontSize: 13, color: '#7A7068', textAlign: 'center' }}>your almari is empty</p>
          <Link href="/upload" style={{ textDecoration: 'none' }}>
            <div style={{ background: M, color: '#F5F0E8', fontSize: 13, fontWeight: 500, padding: '11px 24px', borderRadius: 12 }}>add your first piece</div>
          </Link>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {Object.entries(byCategory).map(([category, catItems]) => (
            <div key={category} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>{category}</span>
                <span style={{ fontSize: 10, color: '#C4B8B0' }}>{catItems.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {catItems.map(item => (
                  <div key={item.id} style={{ borderRadius: 12, overflow: 'hidden', border: '0.5px solid #D8D0C8', position: 'relative' }}>
                    <div style={{ height: 92, background: '#EBE4D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.photoUrl
                        ? <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLOR_HEX[item.primaryColor] ?? '#D8D0C8' }}/>
                      }
                    </div>
                    <div style={{ padding: '5px 8px 6px', background: 'white', borderTop: '0.5px solid #D8D0C8' }}>
                      <p style={{ fontSize: 9, fontWeight: 500, color: '#1A1817', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.name}</p>
                    </div>
                    <div style={{ position: 'absolute', top: 5, left: 5, background: M, color: 'white', fontSize: 8, fontWeight: 500, padding: '2px 5px', borderRadius: 5 }}>
                      {['','sport','casual','smart','semi','formal'][item.formality]}
                    </div>
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
