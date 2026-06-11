'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { OccasionTag, GapSeverity } from '@/lib/types'
import ShopGapButton from '@/app/components/ShopGapButton'

// ── Types ──────────────────────────────────────────────────────

interface OutfitItemResult {
  role: string
  item: {
    id: string
    name: string
    category: string
    subtype: string
    primaryColor: string
    pattern: string
    formality: number
    photoUrl: string | null
  }
}

interface Gap {
  type: string
  severity: GapSeverity
  message: string
  suggestion: string
  nudge: string
  category: string
  colorSuggestions: string[]
  priceRange: { min: number; max: number }
  scoreImpact: number
}

interface OutfitResult {
  score: {
    total: number
    breakdown: {
      colorHarmony: number
      formalityMatch: number
      proportionBalance: number
      patternMix: number
      completeness: number
    }
  }
  stylistNote: {
    headline: string
    colorStory: string
    proportionNote: string
    strengths: string[]
    improvements: string[]
  }
  occasion: string
  gaps: Gap[]
  items: OutfitItemResult[]
}

// ── Constants ──────────────────────────────────────────────────

const OCCASIONS: { value: OccasionTag; label: string; emoji: string }[] = [
  { value: 'casual', label: 'casual', emoji: '☀️' },
  { value: 'office', label: 'office', emoji: '💼' },
  { value: 'smart-casual', label: 'smart casual', emoji: '✨' },
  { value: 'date-night', label: 'date night', emoji: '🌙' },
  { value: 'brunch', label: 'brunch', emoji: '🥂' },
  { value: 'festive', label: 'festive', emoji: '🪔' },
  { value: 'wedding-guest', label: 'wedding guest', emoji: '💐' },
  { value: 'wedding-function', label: 'wedding function', emoji: '🌸' },
  { value: 'party-night', label: 'party', emoji: '🎉' },
  { value: 'travel', label: 'travel', emoji: '✈️' },
  { value: 'college', label: 'college', emoji: '📚' },
  { value: 'sport', label: 'sport', emoji: '🏃' },
]

const COLOR_HEX: Record<string, string> = {
  white: '#FAFAFA', 'off-white': '#F5F0E8', ivory: '#FFFFF0', cream: '#FFF8DC',
  black: '#1A1A1A', charcoal: '#36454F', graphite: '#474747',
  'grey-light': '#D3D3D3', 'grey-medium': '#9E9E9E', 'grey-dark': '#616161',
  navy: '#1B2A4A', camel: '#C19A6B', tan: '#D2B48C', beige: '#F5F0DC',
  brown: '#8B5E3C', red: '#C0392B', crimson: '#DC143C', burgundy: '#800020',
  coral: '#FF6B6B', terracotta: '#C26A4E', rust: '#B7410E', orange: '#E67E22',
  yellow: '#F4D03F', mustard: '#DFAF2C', gold: '#D4AF37', olive: '#808000',
  green: '#27AE60', emerald: '#046307', sage: '#B2AC88', teal: '#008080',
  'blue-light': '#AED6F1', 'blue-sky': '#87CEEB', 'blue-royal': '#2255A4',
  indigo: '#3F51B5', pink: '#F48FB1', blush: '#F2C4CE', rose: '#E8A0BF',
  'hot-pink': '#FF69B4', fuchsia: '#C2185B', purple: '#7B1FA2',
  lavender: '#E6E6FA', plum: '#4A0E4E', saffron: '#FF9933',
  marigold: '#FFA500', peacock: '#006994', 'rani-pink': '#E75480',
}

const SEVERITY_STYLES: Record<GapSeverity, { bg: string; text: string; border: string; label: string }> = {
  critical:    { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'critical' },
  moderate:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'moderate' },
  opportunity: { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC', label: 'opportunity' },
}

const SCORE_GRADE = (n: number) =>
  n >= 85 ? 'polished' : n >= 70 ? 'solid' : n >= 55 ? 'decent' : 'needs work'

const SCORE_COLOR = (n: number) =>
  n >= 85 ? '#0F6E56' : n >= 70 ? '#534AB7' : n >= 55 ? '#854F0B' : '#991B1B'

const SCORE_BG = (n: number) =>
  n >= 85 ? '#E1F5EE' : n >= 70 ? '#EEEDFE' : n >= 55 ? '#FAEEDA' : '#FEF2F2'

// ── Component ──────────────────────────────────────────────────

export default function OotdPage() {
  const [occasion, setOccasion] = useState<OccasionTag>('smart-casual')
  const [loading, setLoading] = useState(false)
  const [outfit, setOutfit] = useState<OutfitResult | null>(null)
  const [showGaps, setShowGaps] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buildOutfit() {
    setLoading(true)
    setOutfit(null)
    setShowGaps(false)
    setError(null)
    try {
      const res = await fetch('/api/ootd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'empty-wardrobe') {
          setError('your wardrobe is empty — add some pieces first')
        } else {
          setError('something went wrong — try again')
        }
        return
      }
      setOutfit(data)
    } catch {
      setError('something went wrong — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 pt-8 pb-28">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
        <h1 className="text-lg font-medium text-gray-900">build an outfit</h1>
      </div>

      {/* Occasion picker */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">occasion</p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(o => (
            <button
              key={o.value}
              onClick={() => { setOccasion(o.value); setOutfit(null) }}
              className="px-3 py-2 rounded-xl text-sm border transition-all"
              style={occasion === o.value
                ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}
            >
              {o.emoji} {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Build button */}
      <button
        onClick={buildOutfit}
        disabled={loading}
        className="w-full py-4 rounded-2xl text-sm font-medium text-white mb-6 transition-opacity"
        style={{ background: '#534AB7', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'building your look...' : outfit ? 'rebuild' : 'build my outfit'}
      </button>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 mb-4">
          {[
            'reading your wardrobe',
            'applying colour theory',
            'balancing visual weight',
            'checking occasion fit',
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <div className="w-5 h-5 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin flex-shrink-0"
                style={{ animationDelay: `${i * 0.15}s` }} />
              <span className="text-sm text-gray-500">{step}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
          {error.includes('wardrobe is empty') && (
            <Link href="/upload" className="text-sm font-medium mt-2 block" style={{ color: '#534AB7' }}>
              add items →
            </Link>
          )}
        </div>
      )}

      {/* Result */}
      {outfit && !loading && (
        <div>

          {/* Score + headline */}
          <div
            className="rounded-2xl p-5 mb-4 flex items-center gap-4"
            style={{ background: SCORE_BG(outfit.score.total) }}
          >
            <div className="flex-shrink-0 text-center">
              <div className="text-4xl font-medium" style={{ color: SCORE_COLOR(outfit.score.total) }}>
                {outfit.score.total}
              </div>
              <div className="text-xs font-medium mt-0.5" style={{ color: SCORE_COLOR(outfit.score.total) }}>
                {SCORE_GRADE(outfit.score.total)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">{outfit.stylistNote.headline}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{outfit.stylistNote.colorStory}</p>
            </div>
          </div>

          {/* Outfit tiles */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {outfit.items.map((oi, i) => (
              <div key={i}
                className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex flex-col"
                style={{ minHeight: 100 }}>
                {oi.item.photoUrl ? (
                  <img src={oi.item.photoUrl} alt={oi.item.name}
                    className="w-full object-cover" style={{ height: 90 }} />
                ) : (
                  <div className="flex items-center justify-center" style={{ height: 90 }}>
                    <div className="w-10 h-10 rounded-full"
                      style={{ background: COLOR_HEX[oi.item.primaryColor] ?? '#E5E7EB' }} />
                  </div>
                )}
                <div className="px-2.5 py-2 bg-white border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-800 truncate">{oi.item.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-400">{oi.item.category}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: '#EEEDFE', color: '#534AB7', fontSize: 9 }}>
                      {oi.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Score breakdown */}
          <div className="rounded-xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">score breakdown</p>
            {[
              { label: 'colour harmony', value: outfit.score.breakdown.colorHarmony, max: 30 },
              { label: 'formality match', value: outfit.score.breakdown.formalityMatch, max: 25 },
              { label: 'proportion', value: outfit.score.breakdown.proportionBalance, max: 20 },
              { label: 'pattern discipline', value: outfit.score.breakdown.patternMix, max: 15 },
              { label: 'completeness', value: outfit.score.breakdown.completeness, max: 10 },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 mb-2 last:mb-0">
                <span className="text-xs text-gray-500 w-32 flex-shrink-0">{row.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.value / row.max) * 100}%`,
                      background: (row.value / row.max) >= 0.8 ? '#1D9E75'
                        : (row.value / row.max) >= 0.6 ? '#534AB7' : '#EF9F27',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{row.value}/{row.max}</span>
              </div>
            ))}
          </div>

          {/* Stylist note */}
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: '#534AB7' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="inline mr-1" style={{ verticalAlign: -1 }}>
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              stylist note
            </p>
            <p className="text-sm text-violet-900 leading-relaxed mb-2">{outfit.stylistNote.proportionNote}</p>
            {outfit.stylistNote.strengths.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {outfit.stylistNote.strengths.map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: '#E1F5EE', color: '#085041' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Style gap button */}
          {outfit.gaps.length > 0 && (
            <button
              onClick={() => setShowGaps(v => !v)}
              className="w-full py-3.5 rounded-2xl text-sm font-medium border-2 mb-4 transition-all"
              style={showGaps
                ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                : { background: 'white', color: '#534AB7', borderColor: '#534AB7' }}
            >
              {showGaps ? 'hide style gaps' : `style gap · ${outfit.gaps.length} thing${outfit.gaps.length > 1 ? 's' : ''} missing`}
            </button>
          )}

          {/* Gap cards */}
          {showGaps && outfit.gaps.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">what would complete this</p>
              {outfit.gaps.map((gap, i) => {
                const style = SEVERITY_STYLES[gap.severity]
                return (
                  <div key={i} className="rounded-2xl border p-4"
                    style={{ background: style.bg, borderColor: style.border }}>

                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium leading-snug" style={{ color: style.text }}>
                        {gap.nudge}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-lg ml-2 flex-shrink-0 font-medium"
                        style={{ background: style.border, color: style.text }}>
                        {style.label}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: style.text, opacity: 0.8 }}>
                      {gap.suggestion}
                    </p>

                    {/* Color suggestions */}
                    {gap.colorSuggestions.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs" style={{ color: style.text, opacity: 0.7 }}>try</span>
                        <div className="flex gap-1.5">
                          {gap.colorSuggestions.slice(0, 5).map(c => (
                            <div key={c} title={c}
                              className="w-5 h-5 rounded-full border border-white"
                              style={{ background: COLOR_HEX[c] ?? '#E5E7EB' }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price range + score impact */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: style.text }}>
                        ₹{gap.priceRange.min.toLocaleString('en-IN')} – ₹{gap.priceRange.max.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs" style={{ color: style.text, opacity: 0.7 }}>
                        +{gap.scoreImpact} pts if fixed
                      </span>
                    </div>

                    <ShopGapButton
                      gapType={gap.type}
                      category={gap.category}
                      colorSuggestions={gap.colorSuggestions}
                      formality={outfit?.items?.[0]?.item?.formality ?? 3}
                      style={{ background: style.text, marginTop: 10 }}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Improvements */}
          {outfit.stylistNote.improvements.length > 0 && (
            <div className="rounded-xl border border-gray-100 p-4 mb-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">to improve</p>
              {outfit.stylistNote.improvements.map(s => (
                <p key={s} className="text-xs text-gray-500 flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span>
                  {s}
                </p>
              ))}
            </div>
          )}

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
        <Link href="/ootd" className="flex flex-col items-center gap-1" style={{ color: '#534AB7' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="text-xs font-medium">ootd</span>
        </Link>
      </nav>
    </main>
  )
}
