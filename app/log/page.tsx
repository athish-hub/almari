'use client'

import { useState, useRef } from 'react'
import ShopGapButton from '@/app/components/ShopGapButton'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────

interface Gap {
  type: string
  severity: 'critical' | 'moderate' | 'opportunity'
  nudge: string
  category: string
  colorSuggestions: string[]
  priceRange: { min: number; max: number }
}

interface Analysis {
  score: number
  headline: string
  compliment: string
  colorStory: string
  occasion: string
  pieces: { name: string; category: string }[]
  strengths: string[]
  improvements: string[]
  gaps: Gap[]
}

// ── Constants ──────────────────────────────────────────────────

const SEVERITY_STYLES = {
  critical:    { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'critical' },
  moderate:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'moderate' },
  opportunity: { bg: '#EEEDFE', text: '#3C3489', border: '#AFA9EC', label: 'opportunity' },
}

const SCORE_COLOR = (n: number) =>
  n >= 85 ? '#0F6E56' : n >= 70 ? '#534AB7' : n >= 55 ? '#854F0B' : '#991B1B'
const SCORE_BG = (n: number) =>
  n >= 85 ? '#E1F5EE' : n >= 70 ? '#EEEDFE' : n >= 55 ? '#FAEEDA' : '#FEF2F2'
const SCORE_GRADE = (n: number) =>
  n >= 85 ? 'polished' : n >= 70 ? 'solid look' : n >= 55 ? 'decent start' : 'needs work'

const MOODS = [
  { value: 'loved-it', label: 'loved it', emoji: '🔥' },
  { value: 'okay',     label: 'okay',     emoji: '👌' },
  { value: 'would-change', label: 'would change', emoji: '🤔' },
]

function resizeBase64(dataUrl: string, maxDim = 1024): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = dataUrl
  })
}

// ── Component ──────────────────────────────────────────────────

export default function LogPage() {
  const cameraRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const [preview,   setPreview]   = useState<string | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [analysis,  setAnalysis]  = useState<Analysis | null>(null)
  const [mood,      setMood]      = useState<string | null>(null)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setAnalysis(null)
      setSaved(false)
      setMood(null)
      await runAnalysis(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  async function runAnalysis(dataUrl: string) {
    setAnalysing(true)
    setError(null)
    try {
      const resized = await resizeBase64(dataUrl)
      const res = await fetch('/api/analyse-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: resized }),
      })
      if (!res.ok) throw new Error('analysis failed')
      const data: Analysis = await res.json()
      setAnalysis(data)
    } catch {
      setError('analysis failed — try again or save without it')
    } finally {
      setAnalysing(false)
    }
  }

  async function saveLog() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl: preview,
          analysis,
          mood,
          occasion: analysis?.occasion ?? 'casual',
        }),
      })
      if (!res.ok) throw new Error('save failed')
      setSaved(true)
    } catch {
      setError('failed to save — try again')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────

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
          <h1 className="text-lg font-medium text-gray-900">log today's look</h1>
          <p className="text-xs text-gray-400">get honest feedback from your stylist</p>
        </div>
        <Link href="/history" className="text-xs font-medium" style={{ color: '#534AB7' }}>
          history →
        </Link>
      </div>

      {/* Upload buttons — shown until photo is picked */}
      {!preview && (
        <div className="space-y-3 mb-6">
          <button
            onClick={() => cameraRef.current?.click()}
            className="w-full rounded-2xl border-2 p-6 flex items-center gap-4 text-left"
            style={{ borderColor: '#534AB7', background: '#EEEDFE' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#534AB7' }}>
              <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: '#26215C' }}>take a mirror selfie</p>
              <p className="text-xs mt-0.5" style={{ color: '#534AB7' }}>opens your camera</p>
            </div>
          </button>

          <button
            onClick={() => galleryRef.current?.click()}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800">upload from gallery</p>
              <p className="text-xs text-gray-400 mt-0.5">pick an existing photo</p>
            </div>
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={cameraRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

      {/* Photo preview */}
      {preview && (
        <div className="relative mb-4 rounded-2xl overflow-hidden">
          <img src={preview} alt="your look" className="w-full max-h-80 object-cover" />

          {/* Analysing overlay */}
          {analysing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(255,255,255,0.9)' }}>
              <div className="w-10 h-10 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
              <p className="text-sm font-medium" style={{ color: '#534AB7' }}>your stylist is looking...</p>
              <p className="text-xs text-gray-400">colour · proportion · gaps</p>
            </div>
          )}

          {/* Re-shoot */}
          {!analysing && (
            <button
              onClick={() => { setPreview(null); setAnalysis(null); setSaved(false) }}
              className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-xl"
            >
              retake
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Analysis results */}
      {analysis && !analysing && (
        <div>

          {/* Score + compliment */}
          <div className="rounded-2xl p-5 mb-4 flex items-start gap-4"
            style={{ background: SCORE_BG(analysis.score) }}>
            <div className="flex-shrink-0 text-center">
              <div className="text-4xl font-medium" style={{ color: SCORE_COLOR(analysis.score) }}>
                {analysis.score}
              </div>
              <div className="text-xs font-medium mt-0.5" style={{ color: SCORE_COLOR(analysis.score) }}>
                {SCORE_GRADE(analysis.score)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">{analysis.headline}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{analysis.compliment}</p>
            </div>
          </div>

          {/* Pieces identified */}
          {analysis.pieces?.length > 0 && (
            <div className="rounded-xl border border-gray-100 p-4 mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">pieces identified</p>
              <div className="flex flex-wrap gap-2">
                {analysis.pieces.map((p, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths?.length > 0 && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-4 mb-4">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wider mb-2">what's working</p>
              {analysis.strengths.map((s, i) => (
                <p key={i} className="text-sm text-green-900 flex items-start gap-2 mb-1 last:mb-0">
                  <span className="text-green-500 flex-shrink-0">✓</span>{s}
                </p>
              ))}
            </div>
          )}

          {/* Improvements */}
          {analysis.improvements?.length > 0 && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 mb-4">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">to improve</p>
              {analysis.improvements.map((s, i) => (
                <p key={i} className="text-sm text-amber-900 flex items-start gap-2 mb-1 last:mb-0">
                  <span className="text-amber-500 flex-shrink-0">→</span>{s}
                </p>
              ))}
            </div>
          )}

          {/* Gaps */}
          {analysis.gaps?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">style gaps</p>
              <div className="space-y-2">
                {analysis.gaps.map((gap, i) => {
                  const style = SEVERITY_STYLES[gap.severity]
                  return (
                    <div key={i} className="rounded-xl border p-3.5"
                      style={{ background: style.bg, borderColor: style.border }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium" style={{ color: style.text }}>{gap.nudge}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 font-medium"
                          style={{ background: style.border, color: style.text }}>
                          {style.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs" style={{ color: style.text, opacity: 0.7 }}>
                          {gap.category}
                        </span>
                        <span className="text-xs font-medium" style={{ color: style.text }}>
                          ₹{gap.priceRange.min.toLocaleString('en-IN')} – ₹{gap.priceRange.max.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <ShopGapButton
                        gapType={gap.type}
                        category={gap.category}
                        colorSuggestions={gap.colorSuggestions}
                        formality={3}
                        style={{ background: style.text, marginTop: 10 }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mood */}
          {!saved && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">how did you feel?</p>
              <div className="flex gap-2">
                {MOODS.map(m => (
                  <button key={m.value} onClick={() => setMood(m.value)}
                    className="flex-1 py-2.5 rounded-xl text-sm border transition-all"
                    style={mood === m.value
                      ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                      : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save / Saved */}
          {saved ? (
            <div className="rounded-2xl p-4 text-center mb-4" style={{ background: '#E1F5EE' }}>
              <p className="text-sm font-medium" style={{ color: '#085041' }}>✓ saved to your look history</p>
              <Link href="/history" className="text-xs mt-1 block" style={{ color: '#0F6E56' }}>
                view all looks →
              </Link>
            </div>
          ) : (
            <button
              onClick={saveLog}
              disabled={saving}
              className="w-full py-4 rounded-2xl text-sm font-medium text-white mb-4"
              style={{ background: '#534AB7', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'saving...' : 'save to look history'}
            </button>
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
        <Link href="/log" className="flex flex-col items-center gap-1" style={{ color: '#534AB7' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span className="text-xs font-medium">log look</span>
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
