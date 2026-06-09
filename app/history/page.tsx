export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'

const DEMO_USER = 'demo'

const SCORE_COLOR = (n: number) =>
  n >= 85 ? '#0F6E56' : n >= 70 ? '#534AB7' : n >= 55 ? '#854F0B' : '#991B1B'
const SCORE_BG = (n: number) =>
  n >= 85 ? '#E1F5EE' : n >= 70 ? '#EEEDFE' : n >= 55 ? '#FAEEDA' : '#FEF2F2'

const MOOD_EMOJI: Record<string, string> = {
  'loved-it': '🔥',
  'okay': '👌',
  'would-change': '🤔',
}

export default async function HistoryPage() {
  const logs = await prisma.dailyLog.findMany({
    where: { userId: DEMO_USER },
    orderBy: { date: 'desc' },
    include: { outfit: true },
    take: 50,
  })

  const parsedLogs = logs.map(log => {
    let note: any = {}
    let gaps: any[] = []
    try { note = JSON.parse(log.outfit.stylistNoteJson) } catch {}
    try { gaps = JSON.parse(log.outfit.gapsJson) } catch {}
    return { ...log, note, gaps }
  })

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 pt-8 pb-28">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-medium text-gray-900">look history</h1>
          <p className="text-xs text-gray-400">{logs.length} {logs.length === 1 ? 'look' : 'looks'} logged</p>
        </div>
        <Link href="/log"
          className="text-xs font-medium px-3 py-1.5 rounded-xl text-white"
          style={{ background: '#534AB7' }}>
          + log today
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#534AB7" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-500">no looks logged yet</p>
          <p className="text-xs text-gray-400 max-w-xs">log your daily outfit to build a style diary and track how your wardrobe evolves</p>
          <Link href="/log"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: '#534AB7' }}>
            log today's look
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {parsedLogs.map(log => (
            <div key={log.id} className="rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex gap-0">

                {/* Photo */}
                <div className="w-28 flex-shrink-0 bg-gray-50">
                  {log.photoUrl ? (
                    <img src={log.photoUrl} alt="look" className="w-full h-full object-cover" style={{ minHeight: 120 }} />
                  ) : (
                    <div className="w-full flex items-center justify-center" style={{ minHeight: 120 }}>
                      <svg width="24" height="24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3.5">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="text-xs text-gray-400">
                        {new Date(log.date).toLocaleDateString('en-IN', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                        {log.mood && <span className="ml-1">{MOOD_EMOJI[log.mood]}</span>}
                      </p>
                      {log.occasion && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md mt-0.5 inline-block"
                          style={{ background: '#EEEDFE', color: '#534AB7' }}>
                          {log.occasion}
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2 text-center px-2.5 py-1 rounded-xl"
                      style={{ background: SCORE_BG(log.outfit.scoreTotal) }}>
                      <p className="text-lg font-medium leading-none" style={{ color: SCORE_COLOR(log.outfit.scoreTotal) }}>
                        {log.outfit.scoreTotal}
                      </p>
                    </div>
                  </div>

                  {log.note?.headline && (
                    <p className="text-sm font-medium text-gray-800 mb-1 leading-snug">
                      {log.note.headline}
                    </p>
                  )}

                  {log.note?.proportionNote && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {log.note.proportionNote}
                    </p>
                  )}

                  {log.gaps?.length > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-gray-400">{log.gaps.length} gap{log.gaps.length > 1 ? 's' : ''}</span>
                      {log.gaps.slice(0, 2).map((g: any, i: number) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded-md"
                          style={{
                            background: g.severity === 'critical' ? '#FEF2F2'
                              : g.severity === 'moderate' ? '#FFFBEB' : '#EEEDFE',
                            color: g.severity === 'critical' ? '#991B1B'
                              : g.severity === 'moderate' ? '#92400E' : '#3C3489',
                          }}>
                          {g.category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-xs">home</span>
        </Link>
        <Link href="/wardrobe" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span className="text-xs">wardrobe</span>
        </Link>
        <Link href="/upload" className="flex flex-col items-center gap-1 text-gray-300">
          <div className="w-10 h-10 rounded-full flex items-center justify-center -mt-5" style={{ background: '#534AB7' }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <span className="text-xs">add</span>
        </Link>
        <Link href="/log" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span className="text-xs">log look</span>
        </Link>
        <Link href="/ootd" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="text-xs">ootd</span>
        </Link>
      </nav>
    </main>
  )
}
