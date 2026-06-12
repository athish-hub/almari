export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import BottomNav from '@/app/components/BottomNav'
import AlmariPattern from '@/app/components/AlmariPattern'

const DEMO_USER = 'demo'

const PF = "'Playfair Display', Georgia, serif"
const SF = "system-ui, -apple-system, sans-serif"
const M  = 'var(--color-primary)'

export default async function HomePage() {
  const items = await prisma.wardrobeItem.findMany({ where: { userId: DEMO_USER, isActive: true } })

  const cats = {
    top:       items.filter(i => i.category === 'top').length,
    bottom:    items.filter(i => i.category === 'bottom').length,
    footwear:  items.filter(i => i.category === 'footwear').length,
    outerwear: items.filter(i => i.category === 'outerwear').length,
    accessory: items.filter(i => i.category === 'accessory').length,
  }

  const pct = Math.min(100, Math.round(
    (Math.min(cats.top, 3) / 3) * 25 + (Math.min(cats.bottom, 3) / 3) * 25 +
    (Math.min(cats.footwear, 2) / 2) * 20 + Math.min(cats.outerwear, 1) * 15 +
    (Math.min(cats.accessory, 2) / 2) * 15
  ))

  const h = new Date().getHours()
  const greeting = h < 12 ? 'good morning' : h < 17 ? 'good afternoon' : 'good evening'
  const day = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).toLowerCase()

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF }}>

      {/* ── top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '42px 20px 14px' }}>
        <span style={{ fontFamily: PF, fontSize: 22, fontWeight: 400, letterSpacing: 5, color: M, textTransform: 'lowercase' }}>almari</span>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F2E8E8', border: '1.5px solid #D4A0A0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: PF, fontSize: 12, color: M }}>A</span>
        </div>
      </div>

      {/* ── hero — uses shared AlmariPattern component ── */}
      <div style={{ background: 'var(--color-primary)', position: 'relative', overflow: 'hidden', padding: 'var(--s-4) var(--s-5) var(--s-5)' }}>
        <AlmariPattern opacity={0.1} height={130} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontFamily: SF, fontSize: 9, color: 'rgba(245,240,232,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{day}</p>
          <p style={{ fontFamily: PF, fontSize: 22, color: 'var(--color-ivory)', lineHeight: 1.2, marginBottom: 2 }}>{greeting},</p>
          <p style={{ fontFamily: PF, fontSize: 22, color: 'var(--color-primary-mid)', lineHeight: 1.2, marginBottom: 10 }}>athish.</p>
          <p style={{ fontFamily: SF, fontSize: 11, color: 'rgba(245,240,232,0.55)' }}>what does today ask of you?</p>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ── log CTA ── */}
        <Link href="/log" style={{ display: 'block', marginTop: 14, marginBottom: 10, textDecoration: 'none' }}>
          <div style={{ background: M, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 400 68" preserveAspectRatio="xMidYMid slice"><rect width="400" height="68" fill="url(#almari-bp)"/></svg>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(245,240,232,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              <svg width="18" height="18" fill="none" stroke="#F5F0E8" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <p style={{ fontFamily: PF, fontSize: 14, color: '#F5F0E8', marginBottom: 2 }}>log today's look</p>
              <p style={{ fontFamily: SF, fontSize: 10, color: 'rgba(245,240,232,0.58)' }}>mirror selfie · instant read</p>
            </div>
            <svg width="13" height="13" fill="none" stroke="rgba(245,240,232,0.4)" strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'relative' }}><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </Link>

        {/* ── build outfit CTA ── */}
        <Link href="/ootd" style={{ display: 'block', marginBottom: 20, textDecoration: 'none' }}>
          <div style={{ background: 'white', border: '0.5px solid #D8D0C8', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: '#F2E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" stroke={M} strokeWidth="1.7" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: SF, fontSize: 13, fontWeight: 500, color: '#1A1817', marginBottom: 3 }}>build an outfit</p>
              <p style={{ fontFamily: SF, fontSize: 10, color: '#7A7068' }}>discover what your almari can do</p>
            </div>
            <svg width="13" height="13" fill="none" stroke="#C4B8B0" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </Link>

        {/* ── completeness ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: SF, fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.5px', textTransform: 'uppercase' }}>almari completeness</span>
            <span style={{ fontFamily: SF, fontSize: 10, fontWeight: 500, color: M }}>{pct}%</span>
          </div>
          <div style={{ height: 2, background: '#D8D0C8', borderRadius: 1 }}>
            <div style={{ width: `${pct}%`, height: 2, background: M, borderRadius: 1 }}/>
          </div>
        </div>

        {/* ── stats ── */}
        {items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'pieces', n: items.length },
              { label: 'categories', n: Object.values(cats).filter(v => v > 0).length },
              { label: 'outfits', n: Math.floor(Math.min(cats.top, cats.bottom) * 1.5) },
            ].map(s => (
              <div key={s.label} style={{ background: '#EBE4D8', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <p style={{ fontFamily: PF, fontSize: 22, color: '#1A1817', fontWeight: 400, lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontFamily: SF, fontSize: 9, color: '#7A7068', marginTop: 5 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── wardrobe grid ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: SF, fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.5px', textTransform: 'uppercase' }}>your almari</span>
          <Link href="/wardrobe" style={{ fontFamily: SF, fontSize: 11, color: M, textDecoration: 'none' }}>see all →</Link>
        </div>

        {items.length === 0 ? (
          <div style={{ border: '1px dashed #C4B8B0', borderRadius: 16, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            <p style={{ fontFamily: SF, fontSize: 13, color: '#7A7068' }}>your almari is empty</p>
            <p style={{ fontFamily: PF, fontSize: 12, fontStyle: 'italic', color: '#C4706F', lineHeight: 1.6 }}>every great wardrobe starts with a single piece.</p>
            <Link href="/upload" style={{ textDecoration: 'none' }}>
              <div style={{ background: M, color: '#F5F0E8', fontFamily: SF, fontSize: 13, fontWeight: 500, padding: '10px 22px', borderRadius: 10, marginTop: 4 }}>add first piece</div>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, paddingBottom: 8 }}>
            {items.slice(0, 5).map(item => (
              <div key={item.id} style={{ borderRadius: 12, overflow: 'hidden', border: '0.5px solid #D8D0C8' }}>
                <div style={{ height: 88, background: '#EBE4D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.photoUrl
                    ? <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <div style={{ width: 26, height: 26, borderRadius: '50%', background: getHex(item.primaryColor) }}/>
                  }
                </div>
                <div style={{ padding: '5px 7px 6px', background: 'white', borderTop: '0.5px solid #D8D0C8' }}>
                  <p style={{ fontFamily: SF, fontSize: 9, fontWeight: 500, color: '#1A1817', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                </div>
              </div>
            ))}
            <Link href="/upload" style={{ textDecoration: 'none' }}>
              <div style={{ borderRadius: 12, border: '1px dashed #C4B8B0', height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <svg width="16" height="16" fill="none" stroke="#C4B8B0" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                <span style={{ fontFamily: SF, fontSize: 9, color: '#C4B8B0' }}>add</span>
              </div>
            </Link>
          </div>
        )}

      </div>

      <BottomNav active="home" />
    </div>
  )
}

function getHex(c: string): string {
  const m: Record<string,string> = {
    white:'#FAFAFA',black:'#1A1A1A',navy:'#1B2A4A',camel:'#C19A6B',red:'#C0392B',
    blue:'#2255A4',green:'#27AE60',yellow:'#F4D03F',pink:'#F48FB1',purple:'#7B1FA2',
    orange:'#E67E22',teal:'#008080',grey:'#9E9E9E',beige:'#F5F0DC',brown:'#8B5E3C',
    olive:'#808000',coral:'#FF6B6B',rose:'#E8A0BF',mustard:'#DFAF2C',burgundy:'#800020',
    maroon:'#800000',tan:'#D2B48C',charcoal:'#36454F',
  }
  return m[c] ?? '#EBE4D8'
}
