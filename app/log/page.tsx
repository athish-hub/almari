'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import ShopGapButton from '@/app/components/ShopGapButton'
import BottomNav from '@/app/components/BottomNav'

const M  = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

interface Gap { type: string; severity: 'critical'|'moderate'|'opportunity'; nudge: string; category: string; colorSuggestions: string[]; priceRange: { min: number; max: number } }
interface Analysis { score: number; headline: string; compliment: string; colorStory: string; occasion: string; pieces: { name: string; category: string }[]; strengths: string[]; improvements: string[]; gaps: Gap[] }

const GAP_SEV = {
  critical:    { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'critical' },
  moderate:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', label: 'moderate' },
  opportunity: { bg: '#F2E8E8', text: '#5C2020', border: '#D4A0A0', label: 'opportunity' },
}
const scoreColor = (n: number) => n >= 85 ? '#0F6E56' : n >= 70 ? M : n >= 55 ? '#854F0B' : '#991B1B'
const scoreBg    = (n: number) => n >= 85 ? '#E1F5EE' : n >= 70 ? '#F2E8E8' : n >= 55 ? '#FAEEDA' : '#FEF2F2'
const scoreGrade = (n: number) => n >= 85 ? 'polished' : n >= 70 ? 'solid look' : n >= 55 ? 'decent start' : 'needs work'

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

export default function LogPage() {
  const camRef = useRef<HTMLInputElement>(null)
  const galRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl); setAnalysis(null); setSaved(false); setMood(null)
      setAnalysing(true); setError(null)
      try {
        const resized = await resizeBase64(dataUrl)
        const res = await fetch('/api/analyse-outfit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: resized }) })
        if (!res.ok) throw new Error()
        setAnalysis(await res.json())
      } catch { setError('analysis failed — fill in manually or try again') }
      finally { setAnalysing(false) }
    }
    reader.readAsDataURL(file)
  }

  async function saveLog() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photoUrl: preview, analysis, mood, occasion: analysis?.occasion ?? 'casual' }) })
      if (!res.ok) throw new Error()
      setSaved(true)
    } catch { setError('failed to save — try again') }
    finally { setSaving(false) }
  }

  const btn = (bg: string, color: string, text: string, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', background: bg, color, fontFamily: SF, fontSize: 13, fontWeight: 500, opacity: disabled ? 0.5 : 1 }}>{text}</button>
  )

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 80 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '42px 20px 20px' }}>
        <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: PF, fontSize: 16, color: 'var(--color-text)' }}>log today's look</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>get honest feedback from your stylist</p>
        </div>
        <Link href="/history" style={{ textDecoration: 'none', fontSize: 11, color: M, fontWeight: 500 }}>history →</Link>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* upload buttons */}
        {!preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <button onClick={() => camRef.current?.click()} style={{ background: '#F2E8E8', border: `1.5px solid ${M}`, borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' as const }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: M, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: PF, fontSize: 14, color: 'var(--color-text)', marginBottom: 2 }}>take a mirror selfie</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>opens your camera</p>
              </div>
            </button>
            <button onClick={() => galRef.current?.click()} style={{ background: 'white', border: '0.5px solid var(--color-ivory-border)', borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' as const }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-ivory-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" fill="none" stroke="#7A7068" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', marginBottom: 2 }}>upload from gallery</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>pick an existing photo</p>
              </div>
            </button>
          </div>
        )}

        <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
        <input ref={galRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />

        {/* preview */}
        {preview && (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
            <img src={preview} alt="your look" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }}/>
            {analysing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,240,232,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${M}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}/>
                <p style={{ fontFamily: PF, fontSize: 14, color: M }}>your stylist is looking...</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>colour · proportion · gaps</p>
              </div>
            )}
            {!analysing && (
              <button onClick={() => { setPreview(null); setAnalysis(null); setSaved(false) }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(26,24,23,0.55)', color: 'white', border: 'none', padding: '5px 11px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>retake</button>
            )}
          </div>
        )}

        {error && (
          <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 12, padding: '11px 14px', marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: '#991B1B' }}>{error}</p>
          </div>
        )}

        {analysis && !analysing && (
          <>
            {/* score hero */}
            <div style={{ background: M, borderRadius: 16, padding: '16px 18px', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="100" fill="url(#almari-bp)"/>
              </svg>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: PF, fontSize: 46, fontWeight: 400, color: '#F5F0E8', lineHeight: 1 }}>{analysis.score}</p>
                  <p style={{ fontSize: 9, color: '#C4706F', letterSpacing: 2, textTransform: 'uppercase' as const, marginTop: 3 }}>{scoreGrade(analysis.score)}</p>
                </div>
                <div style={{ flex: 1, borderLeft: '0.5px solid rgba(245,240,232,0.2)', paddingLeft: 14 }}>
                  <p style={{ fontFamily: PF, fontSize: 13, color: '#F5F0E8', lineHeight: 1.4, marginBottom: 5 }}>{analysis.headline}</p>
                  <p style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 11, color: 'rgba(245,240,232,0.68)', lineHeight: 1.6 }}>{analysis.compliment}</p>
                </div>
              </div>
            </div>

            {/* pieces */}
            {(analysis.pieces ?? []).length > 0 && (
              <div style={{ background: 'white', border: '0.5px solid var(--color-ivory-border)', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase' as const, marginBottom: 8 }}>pieces read</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {(analysis.pieces ?? []).map((p, i) => <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 7, border: '0.5px solid var(--color-ivory-border)', color: 'var(--color-text)' }}>{p.name}</span>)}
                </div>
              </div>
            )}

            {/* strengths */}
            {(analysis.strengths ?? []).length > 0 && (
              <div style={{ background: '#E8F3EE', border: '0.5px solid #9FE1CB', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: '#085041', letterSpacing: '1.2px', textTransform: 'uppercase' as const, marginBottom: 8 }}>what's working</p>
                {(analysis.strengths ?? []).map((s, i) => <p key={i} style={{ fontSize: 12, color: '#04342C', marginBottom: 5, display: 'flex', gap: 7 }}><span style={{ color: '#1D9E75' }}>✓</span>{s}</p>)}
              </div>
            )}

            {/* improvements */}
            {analysis.improvements?.length > 0 && (
              <div style={{ background: '#FFFBEB', border: '0.5px solid #FDE68A', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: '#92400E', letterSpacing: '1.2px', textTransform: 'uppercase' as const, marginBottom: 8 }}>to improve</p>
                {(analysis.improvements ?? []).map((s, i) => <p key={i} style={{ fontSize: 12, color: '#78350F', marginBottom: 5, display: 'flex', gap: 7 }}><span style={{ color: '#EF9F27' }}>→</span>{s}</p>)}
              </div>
            )}

            {/* gaps */}
            {(analysis.gaps ?? []).length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: 8 }}>style gaps</p>
                {(analysis.gaps ?? []).map((gap, i) => {
                  const s = GAP_SEV[gap.severity]
                  return (
                    <div key={i} style={{ background: s.bg, border: `0.5px solid ${s.border}`, borderRadius: 12, padding: '11px 13px', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <p style={{ fontFamily: PF, fontSize: 12, fontWeight: 500, color: s.text, flex: 1 }}>{gap.nudge}</p>
                        <span style={{ fontSize: 9, background: s.border, color: s.text, padding: '2px 6px', borderRadius: 5, marginLeft: 8, flexShrink: 0 }}>{s.label}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: s.text, opacity: 0.7 }}>{gap.category}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: s.text }}>₹{gap.priceRange.min.toLocaleString('en-IN')} – ₹{gap.priceRange.max.toLocaleString('en-IN')}</span>
                      </div>
                      <ShopGapButton gapType={gap.type} category={gap.category} colorSuggestions={gap.colorSuggestions} formality={3} style={{ background: s.text }}/>
                    </div>
                  )
                })}
              </div>
            )}

            {/* mood */}
            {!saved && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: 8 }}>how did you feel?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['loved-it','🔥 loved it'],['okay','👌 okay'],['would-change','🤔 would change']].map(([v, l]) => (
                    <button key={v} onClick={() => setMood(v)} style={{ flex: 1, padding: '9px 4px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mood === v ? M : 'white', color: mood === v ? '#F5F0E8' : 'var(--color-text)', fontFamily: SF, fontSize: 11, outline: mood === v ? 'none' : '0.5px solid #D8D0C8' }}>{l}</button>
                  ))}
                </div>
              </div>
            )}

            {/* save / saved */}
            {saved ? (
              <div style={{ background: '#E8F3EE', borderRadius: 14, padding: '14px', textAlign: 'center', marginBottom: 12 }}>
                <p style={{ fontFamily: PF, fontSize: 14, color: '#085041', marginBottom: 4 }}>✓ saved to your look history</p>
                <Link href="/history" style={{ fontSize: 12, color: '#0F6E56', textDecoration: 'none' }}>view all looks →</Link>
              </div>
            ) : (
              btn(M, '#F5F0E8', saving ? 'saving...' : 'save to look history', saveLog, saving)
            )}
          </>
        )}
      </div>

      <BottomNav active="today" />
      
    </div>
  )
}
