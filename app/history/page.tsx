export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import DeleteLogButton from './DeleteLogButton'
import BottomNav from '@/app/components/BottomNav'

const DEMO_USER = 'demo'
const M = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

const scoreColor = (n: number) => n >= 85 ? '#0F6E56' : n >= 70 ? M : n >= 55 ? '#854F0B' : '#991B1B'
const scoreBg    = (n: number) => n >= 85 ? '#E1F5EE' : n >= 70 ? '#F2E8E8' : n >= 55 ? '#FAEEDA' : '#FEF2F2'

const MOOD: Record<string, string> = { 'loved-it': '🔥', 'okay': '👌', 'would-change': '🤔' }

export default async function HistoryPage() {
  const logs = await prisma.dailyLog.findMany({
    where: { userId: DEMO_USER },
    orderBy: { date: 'desc' },
    include: { outfit: true },
    take: 50,
  })

  const parsed = logs.map(log => {
    let note: any = {}; let gaps: any[] = []
    try { note = JSON.parse(log.outfit.stylistNoteJson) } catch {}
    try { gaps = JSON.parse(log.outfit.gapsJson) } catch {}
    return { ...log, note, gaps }
  })

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 80 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '42px 20px 20px' }}>
        <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: PF, fontSize: 16, color: 'var(--color-text)' }}>look history</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>{logs.length} {logs.length === 1 ? 'look' : 'looks'} logged</p>
        </div>
        <Link href="/log" style={{ textDecoration: 'none', background: M, color: '#F5F0E8', fontSize: 11, fontWeight: 500, padding: '7px 14px', borderRadius: 10 }}>
          + log today
        </Link>
      </div>

      <div style={{ padding: '0 16px' }}>
        {parsed.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F2E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke={M} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>no looks logged yet</p>
            <p style={{ fontFamily: PF, fontSize: 12, fontStyle: 'italic', color: '#C4706F', lineHeight: 1.6 }}>your style diary starts with one selfie.</p>
            <Link href="/log" style={{ textDecoration: 'none' }}>
              <div style={{ background: M, color: '#F5F0E8', fontSize: 13, fontWeight: 500, padding: '11px 24px', borderRadius: 12 }}>log today's look</div>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {parsed.map(log => (
              <div key={log.id} style={{ borderRadius: 16, border: '0.5px solid var(--color-ivory-border)', overflow: 'hidden', background: 'white', display: 'flex' }}>
                {/* photo */}
                <div style={{ width: 90, flexShrink: 0, background: 'var(--color-ivory-deep)' }}>
                  {log.photoUrl
                    ? <img src={log.photoUrl} alt="look" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 110 }}/>
                    : <div style={{ width: '100%', minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" fill="none" stroke="#C4B8B0" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>
                      </div>
                  }
                </div>
                {/* content */}
                <div style={{ flex: 1, padding: '12px 12px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                        {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {log.mood ? <span style={{ marginLeft: 4 }}>{MOOD[log.mood]}</span> : null}
                      </p>
                      {log.occasion && (
                        <span style={{ fontSize: 9, background: '#F2E8E8', color: M, padding: '2px 7px', borderRadius: 6, display: 'inline-block', marginTop: 3 }}>{log.occasion}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ background: scoreBg(log.outfit.scoreTotal), borderRadius: 10, padding: '4px 8px', textAlign: 'center' }}>
                        <p style={{ fontFamily: PF, fontSize: 16, fontWeight: 400, color: scoreColor(log.outfit.scoreTotal), lineHeight: 1 }}>{log.outfit.scoreTotal}</p>
                      </div>
                      <DeleteLogButton id={log.id} />
                    </div>
                  </div>
                  {log.note?.headline && <p style={{ fontSize: 11, fontFamily: PF, color: 'var(--color-text)', lineHeight: 1.4, marginBottom: 4 }}>{log.note.headline}</p>}
                  {log.note?.proportionNote && <p style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{log.note.proportionNote}</p>}
                  {log.gaps?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center' }}>
                      {log.gaps.slice(0, 2).map((g: any, i: number) => (
                        <span key={i} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: g.severity === 'critical' ? '#FEF2F2' : g.severity === 'moderate' ? '#FFFBEB' : '#F2E8E8', color: g.severity === 'critical' ? '#991B1B' : g.severity === 'moderate' ? '#92400E' : '#5C2020' }}>{g.category}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="today" />
    </div>
  )
}
