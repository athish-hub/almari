'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { OccasionTag, GapSeverity } from '@/lib/types'
import ShopGapButton from '@/app/components/ShopGapButton'
import BottomNav from '@/app/components/BottomNav'

const M  = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

interface OutfitItem { role: string; item: { id: string; name: string; category: string; primaryColor: string; formality: number; photoUrl: string | null } }
interface Gap { type: string; severity: GapSeverity; nudge: string; suggestion: string; category: string; colorSuggestions: string[]; priceRange: { min: number; max: number }; scoreImpact: number }
interface Outfit {
  score: { total: number; breakdown: { colorHarmony: number; formalityMatch: number; proportionBalance: number; patternMix: number; completeness: number } }
  stylistNote: { headline: string; colorStory: string; proportionNote: string; strengths: string[]; improvements: string[] }
  occasion: string; gaps: Gap[]; items: OutfitItem[]
}

const OCCASIONS: { value: OccasionTag; label: string }[] = [
  { value: 'casual', label: '☀️ casual' }, { value: 'office', label: '💼 office' },
  { value: 'smart-casual', label: '✨ smart casual' }, { value: 'date-night', label: '🌙 date night' },
  { value: 'brunch', label: '🥂 brunch' }, { value: 'festive', label: '🪔 festive' },
  { value: 'wedding-guest', label: '💐 wedding guest' }, { value: 'wedding-function', label: '🌸 wedding function' },
  { value: 'party-night', label: '🎉 party' }, { value: 'travel', label: '✈️ travel' },
  { value: 'college', label: '📚 college' }, { value: 'sport', label: '🏃 sport' },
]

const GAP_SEV: Record<GapSeverity, { bg: string; text: string; border: string; label: string }> = {
  critical:    { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'critical' },
  moderate:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'moderate' },
  opportunity: { bg: '#F2E8E8', text: '#5C2020', border: '#D4A0A0', label: 'opportunity' },
}

const scoreColor = (n: number) => n >= 85 ? '#0F6E56' : n >= 70 ? M : n >= 55 ? '#854F0B' : '#991B1B'
const scoreBg    = (n: number) => n >= 85 ? '#E1F5EE' : n >= 70 ? '#F2E8E8' : n >= 55 ? '#FAEEDA' : '#FEF2F2'
const scoreGrade = (n: number) => n >= 85 ? 'polished' : n >= 70 ? 'solid look' : n >= 55 ? 'decent start' : 'needs work'

const COLOR_HEX: Record<string, string> = { white:'#FAFAFA',black:'#1A1A1A',navy:'#1B2A4A',camel:'#C19A6B',red:'#C0392B',blue:'#2255A4',green:'#27AE60',yellow:'#F4D03F',pink:'#F48FB1',purple:'#7B1FA2',orange:'#E67E22',teal:'#008080',grey:'#9E9E9E',beige:'#F5F0DC',brown:'#8B5E3C',olive:'#808000',coral:'#FF6B6B',rose:'#E8A0BF',mustard:'#DFAF2C',burgundy:'#800020',maroon:'#800000',tan:'#D2B48C',charcoal:'#36454F' }

export default function OotdPage() {
  const [occasion, setOccasion] = useState<OccasionTag>('smart-casual')
  const [loading, setLoading] = useState(false)
  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [showGaps, setShowGaps] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buildOutfit() {
    setLoading(true); setOutfit(null); setShowGaps(false); setError(null)
    try {
      const res = await fetch('/api/ootd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ occasion }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error === 'empty-wardrobe' ? 'add some pieces to your almari first' : 'something went wrong — try again'); return }
      setOutfit(data)
    } catch { setError('something went wrong — try again') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 80 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '42px 20px 20px' }}>
        <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <p style={{ fontFamily: PF, fontSize: 16, color: 'var(--color-text)' }}>build an outfit</p>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* occasion */}
        <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: 10 }}>occasion</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
          {OCCASIONS.map(o => (
            <button key={o.value} onClick={() => { setOccasion(o.value); setOutfit(null) }}
              style={{ fontFamily: SF, fontSize: 12, padding: '7px 13px', borderRadius: 10, border: 'none', cursor: 'pointer', background: occasion === o.value ? M : 'white', color: occasion === o.value ? '#F5F0E8' : 'var(--color-text)', outline: occasion === o.value ? 'none' : '0.5px solid #D8D0C8' }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* build button */}
        <button onClick={buildOutfit} disabled={loading}
          style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: M, color: '#F5F0E8', fontFamily: PF, fontSize: 15, opacity: loading ? 0.7 : 1, marginBottom: 16 }}>
          {loading ? 'building your look...' : outfit ? 'rebuild' : 'build my outfit'}
        </button>

        {/* loading */}
        {loading && (
          <div style={{ background: 'var(--color-ivory-deep)', borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
            {['reading your wardrobe','applying colour theory','balancing visual weight','checking occasion fit'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '0.5px solid #D8D0C8' : 'none' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${M}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#991B1B' }}>{error}</p>
            {error.includes('almari') && <Link href="/upload" style={{ fontSize: 12, color: M, textDecoration: 'none', display: 'block', marginTop: 5 }}>add pieces →</Link>}
          </div>
        )}

        {/* result */}
        {outfit && !loading && (
          <>
            {/* score hero */}
            <div style={{ background: M, borderRadius: 16, padding: '18px', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.09 }} viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice">
                <defs><pattern id="bp2" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse"><g transform="translate(26,26)" fill="#F5F0E8"><rect x="-4" y="-4" width="8" height="8" transform="rotate(45)"/><rect x="-2" y="-17" width="4" height="11" rx="1.5"/><rect x="-2" y="6" width="4" height="11" rx="1.5"/><rect x="-17" y="-2" width="11" height="4" rx="1.5"/><rect x="6" y="-2" width="11" height="4" rx="1.5"/></g></pattern></defs>
                <rect width="400" height="100" fill="url(#almari-bp)"/>
              </svg>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: PF, fontSize: 48, fontWeight: 400, color: '#F5F0E8', lineHeight: 1 }}>{outfit.score.total}</p>
                  <p style={{ fontSize: 9, color: '#C4706F', letterSpacing: 2, textTransform: 'uppercase' as const, marginTop: 3 }}>{scoreGrade(outfit.score.total)}</p>
                </div>
                <div style={{ flex: 1, borderLeft: '0.5px solid rgba(245,240,232,0.2)', paddingLeft: 14 }}>
                  <p style={{ fontFamily: PF, fontSize: 13, color: '#F5F0E8', lineHeight: 1.4, marginBottom: 5 }}>{outfit.stylistNote.headline}</p>
                  <p style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 11, color: 'rgba(245,240,232,0.65)', lineHeight: 1.6 }}>{outfit.stylistNote.colorStory}</p>
                </div>
              </div>
            </div>

            {/* outfit tiles 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {outfit.items.map((oi, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 14, border: '0.5px solid var(--color-ivory-border)', overflow: 'hidden' }}>
                  {oi.item.photoUrl
                    ? <img src={oi.item.photoUrl} alt={oi.item.name} style={{ width: '100%', height: 88, objectFit: 'cover' }}/>
                    : <div style={{ height: 88, background: 'var(--color-ivory-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLOR_HEX[oi.item.primaryColor] ?? '#D8D0C8' }}/>
                      </div>
                  }
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-text)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{oi.item.name}</p>
                    <span style={{ fontSize: 8, background: '#F2E8E8', color: M, padding: '2px 6px', borderRadius: 5 }}>{oi.role}</span>
                  </div>
                </div>
              ))}
              {outfit.items.length < 4 && Array.from({ length: 4 - outfit.items.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ background: 'white', borderRadius: 14, border: '1px dashed #D8D0C8', height: 118, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                  <svg width="18" height="18" fill="none" stroke="#C4B8B0" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  <span style={{ fontSize: 9, color: 'var(--color-text-faint)' }}>missing</span>
                </div>
              ))}
            </div>

            {/* score breakdown */}
            <div style={{ background: 'white', borderRadius: 14, border: '0.5px solid var(--color-ivory-border)', padding: '14px', marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase' as const, marginBottom: 10 }}>score breakdown</p>
              {[
                { label: 'colour harmony', v: outfit.score.breakdown.colorHarmony, max: 30 },
                { label: 'formality match', v: outfit.score.breakdown.formalityMatch, max: 25 },
                { label: 'proportion', v: outfit.score.breakdown.proportionBalance, max: 20 },
                { label: 'pattern', v: outfit.score.breakdown.patternMix, max: 15 },
                { label: 'completeness', v: outfit.score.breakdown.completeness, max: 10 },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 110, flexShrink: 0 }}>{r.label}</span>
                  <div style={{ flex: 1, height: 4, background: 'var(--color-ivory-deep)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${(r.v / r.max) * 100}%`, height: 4, background: r.v / r.max >= 0.8 ? '#1D9E75' : r.v / r.max >= 0.6 ? M : '#EF9F27', borderRadius: 2 }}/>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', width: 36, textAlign: 'right' as const }}>{r.v}/{r.max}</span>
                </div>
              ))}
            </div>

            {/* stylist note */}
            <div style={{ background: '#F2E8E8', borderRadius: 14, padding: '12px 14px', marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 500, color: M, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 6 }}>✦ stylist note</p>
              <p style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 12, color: '#5C2020', lineHeight: 1.6, marginBottom: 8 }}>{outfit.stylistNote.proportionNote}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {outfit.stylistNote.strengths.map((s, i) => (
                  <span key={i} style={{ fontSize: 10, background: 'rgba(123,48,48,0.1)', color: M, padding: '3px 8px', borderRadius: 7 }}>✓ {s}</span>
                ))}
              </div>
            </div>

            {/* style gap toggle */}
            {outfit.gaps.length > 0 && (
              <button onClick={() => setShowGaps(v => !v)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1.5px solid ${M}`, background: showGaps ? M : 'transparent', color: showGaps ? '#F5F0E8' : M, fontFamily: SF, fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>
                {showGaps ? 'hide style gaps' : `style gap · ${outfit.gaps.length} thing${outfit.gaps.length > 1 ? 's' : ''} missing`}
              </button>
            )}

            {/* gap cards */}
            {showGaps && outfit.gaps.map((gap, i) => {
              const s = GAP_SEV[gap.severity]
              return (
                <div key={i} style={{ background: s.bg, border: `0.5px solid ${s.border}`, borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <p style={{ fontFamily: PF, fontSize: 13, fontWeight: 500, color: s.text, flex: 1 }}>{gap.nudge}</p>
                    <span style={{ fontSize: 9, background: s.border, color: s.text, padding: '2px 7px', borderRadius: 6, flexShrink: 0, marginLeft: 8 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 11, color: s.text, opacity: 0.8, lineHeight: 1.5, marginBottom: 8 }}>{gap.suggestion}</p>
                  {gap.colorSuggestions.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: s.text, opacity: 0.7 }}>try</span>
                      {gap.colorSuggestions.slice(0, 5).map(c => (
                        <div key={c} title={c} style={{ width: 16, height: 16, borderRadius: '50%', background: COLOR_HEX[c] ?? '#D8D0C8', border: '0.5px solid rgba(0,0,0,0.1)' }}/>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: s.text }}>₹{gap.priceRange.min.toLocaleString('en-IN')} – ₹{gap.priceRange.max.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 10, color: s.text, opacity: 0.7 }}>+{gap.scoreImpact} pts if fixed</span>
                  </div>
                  <ShopGapButton gapType={gap.type} category={gap.category} colorSuggestions={gap.colorSuggestions} formality={3} style={{ background: s.text }}/>
                </div>
              )
            })}

            {/* improvements */}
            {outfit.stylistNote.improvements.length > 0 && (
              <div style={{ background: 'white', border: '0.5px solid var(--color-ivory-border)', borderRadius: 14, padding: '12px 14px', marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase' as const, marginBottom: 8 }}>to improve</p>
                {outfit.stylistNote.improvements.map((s, i) => (
                  <p key={i} style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 5, display: 'flex', gap: 7 }}><span style={{ color: '#EF9F27' }}>→</span>{s}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav active="outfit" />
      
    </div>
  )
}
