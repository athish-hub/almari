'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const M  = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

interface Gap { type: string; severity: string; nudge: string; suggestion: string; category: string; colorSuggestions: string[]; priceRange: { min: number; max: number } }
interface Analysis {
  score: number; headline: string; compliment: string; colorStory: string; occasion: string;
  pieces: { name: string; category: string }[];
  strengths: string[]; improvements: string[]; gaps: Gap[];
}

const SEV_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  critical:    { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  moderate:    { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  opportunity: { bg: '#F2E8E8', text: '#5C2020', border: '#D4A0A0' },
}

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

const scoreColor = (n: number) => n >= 85 ? '#0F6E56' : n >= 70 ? M : n >= 55 ? '#854F0B' : '#991B1B'
const scoreBg    = (n: number) => n >= 85 ? '#E1F5EE' : n >= 70 ? '#F2E8E8' : n >= 55 ? '#FAEEDA' : '#FEF2F2'
const scoreGrade = (n: number) => n >= 85 ? 'polished' : n >= 70 ? 'good start' : n >= 55 ? 'decent base' : 'needs work'

export default function OutfitCheckPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview,   setPreview]   = useState<string | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [analysis,  setAnalysis]  = useState<Analysis | null>(null)
  const [error,     setError]     = useState<string | null>(null)
  const [step,      setStep]      = useState(0)

  const analyseSteps = ['identifying pieces', 'scoring colour palette', 'checking proportion', 'finding style gaps']

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl); setAnalysis(null); setError(null)
      setAnalysing(true); setStep(0)

      const t1 = setTimeout(() => setStep(1), 500)
      const t2 = setTimeout(() => setStep(2), 1100)
      const t3 = setTimeout(() => setStep(3), 1700)

      try {
        const resized = await resizeBase64(dataUrl)
        const res = await fetch('/api/analyse-outfit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: resized }) })
        if (!res.ok) throw new Error()
        const data: Analysis = await res.json()
        setTimeout(() => { setAnalysis(data); setAnalysing(false) }, 2000)
      } catch {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
        setError('analysis failed — try a clearer photo or try again')
        setAnalysing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function reset() { setPreview(null); setAnalysis(null); setError(null); setStep(0) }

  const shopUrl = (gap: Gap) =>
    `/shop?gap=${encodeURIComponent(gap.type)}&category=${encodeURIComponent(gap.category)}&colors=${encodeURIComponent(gap.colorSuggestions.slice(0,3).join(','))}&formality=3&item=${encodeURIComponent(gap.nudge)}`

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF }}>

      {/* nav bar */}
      <div style={{ background: '#F5F0E8', borderBottom: '0.5px solid #D8D0C8', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: PF, fontSize: 18, fontWeight: 400, letterSpacing: 4, color: M, textTransform: 'lowercase' }}>almari</span>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 12, color: M, fontWeight: 500 }}>outfit check</span>
          <Link href="/outfit-ideas" style={{ fontSize: 12, color: '#7A7068', textDecoration: 'none' }}>outfit ideas</Link>
        </div>
        <Link href="/" style={{ fontSize: 11, fontWeight: 500, padding: '6px 13px', borderRadius: 8, background: M, color: '#F5F0E8', textDecoration: 'none' }}>get the app</Link>
      </div>

      {/* hero */}
      <div style={{ background: M, padding: '20px 20px 22px', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 430 130" preserveAspectRatio="xMidYMid slice">
          <defs><pattern id="bp" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse"><g transform="translate(26,26)" fill="#F5F0E8"><rect x="-4" y="-4" width="8" height="8" transform="rotate(45)"/><rect x="-2" y="-17" width="4" height="11" rx="1.5"/><rect x="-2" y="6" width="4" height="11" rx="1.5"/><rect x="-17" y="-2" width="11" height="4" rx="1.5"/><rect x="6" y="-2" width="11" height="4" rx="1.5"/><circle r="2" cx="-11" cy="-11"/><circle r="2" cx="11" cy="-11"/><circle r="2" cx="-11" cy="11"/><circle r="2" cx="11" cy="11"/></g></pattern></defs>
          <rect width="430" height="130" fill="url(#bp)"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 9, color: 'rgba(245,240,232,0.55)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>already dressed? · free · no login</p>
          <p style={{ fontFamily: PF, fontSize: 22, color: '#F5F0E8', lineHeight: 1.2, marginBottom: 8 }}>Wearing something right now? Let's make it work.</p>
          <p style={{ fontSize: 12, color: '#C4B0B0', lineHeight: 1.6 }}>Upload what you have on — get told what's working, what to ditch, and the one thing that fixes it.</p>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>

        {/* upload zone or photo */}
        {!preview ? (
          <div onClick={() => fileRef.current?.click()}
            style={{ background: '#EBE4D8', border: '0.5px solid #D8D0C8', borderRadius: 16, height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', marginBottom: 14 }}>
            <svg width="30" height="30" fill="none" stroke="#C4B8B0" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span style={{ fontSize: 13, color: '#7A7068' }}>upload your look</span>
            <span style={{ fontSize: 10, color: '#C4706F' }}>mirror selfie or flat lay</span>
          </div>
        ) : (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
            <img src={preview} alt="your look" style={{ width: '100%', maxHeight: analysed(analysis) ? 130 : 280, objectFit: 'cover', display: 'block', transition: 'max-height 0.4s ease' }}/>
            {analysing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,24,23,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid rgba(245,240,232,0.2)', borderTopColor: '#F5F0E8', animation: 'spin 0.85s linear infinite' }}/>
                <p style={{ fontFamily: PF, fontSize: 13, color: '#F5F0E8' }}>reading your look...</p>
              </div>
            )}
            {!analysing && (
              <button onClick={reset} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(26,24,23,0.55)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: 7, fontSize: 10, cursor: 'pointer', fontFamily: SF }}>
                try again
              </button>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />

        {/* analysing step list */}
        {analysing && (
          <div style={{ background: '#EBE4D8', borderRadius: 14, padding: '12px 16px', marginBottom: 14 }}>
            {analyseSteps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 8 : 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: step > i ? M : 'transparent', border: step > i ? 'none' : `1.5px solid ${step === i ? '#C4706F' : '#D8D0C8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                  {step > i && <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                  {step === i && <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #C4706F', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}/>}
                </div>
                <span style={{ fontSize: 12, color: step > i ? '#1A1817' : step === i ? '#7A7068' : '#C4B8B0' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: '#991B1B' }}>{error}</p>
          </div>
        )}

        {/* results */}
        {analysis && !analysing && (
          <>
            {/* score hero */}
            <div style={{ background: M, borderRadius: 16, padding: '14px 16px', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.09 }} viewBox="0 0 400 90" preserveAspectRatio="xMidYMid slice"><rect width="400" height="90" fill="url(#bp)"/></svg>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: PF, fontSize: 46, fontWeight: 400, color: '#F5F0E8', lineHeight: 1 }}>{analysis.score}</p>
                  <p style={{ fontSize: 8, color: '#C4706F', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3 }}>{scoreGrade(analysis.score)}</p>
                </div>
                <div style={{ flex: 1, borderLeft: '0.5px solid rgba(245,240,232,0.2)', paddingLeft: 14 }}>
                  <p style={{ fontFamily: PF, fontSize: 13, color: '#F5F0E8', lineHeight: 1.4, marginBottom: 5 }}>{analysis.headline}</p>
                  <p style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 11, color: 'rgba(245,240,232,0.65)', lineHeight: 1.6 }}>{analysis.compliment}</p>
                </div>
              </div>
            </div>

            {/* keep / swap / add */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 12 }}>
              <div style={{ background: '#E8F3EE', border: '0.5px solid #9FE1CB', borderRadius: 10, padding: '8px 9px' }}>
                <p style={{ fontSize: 8, fontWeight: 500, color: '#085041', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>keep</p>
                {analysis.strengths.slice(0, 2).map((s, i) => <p key={i} style={{ fontSize: 10, color: '#04342C', lineHeight: 1.4, marginBottom: 3 }}>✓ {s}</p>)}
                {analysis.strengths.length === 0 && <p style={{ fontSize: 10, color: '#7A7068' }}>looking good</p>}
              </div>
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: 10, padding: '8px 9px' }}>
                <p style={{ fontSize: 8, fontWeight: 500, color: '#991B1B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>swap out</p>
                {analysis.improvements.slice(0, 2).map((s, i) => <p key={i} style={{ fontSize: 10, color: '#7D1F1F', lineHeight: 1.4, marginBottom: 3 }}>→ {s}</p>)}
                {analysis.improvements.length === 0 && <p style={{ fontSize: 10, color: '#7A7068' }}>nothing to fix</p>}
              </div>
              <div style={{ background: '#FFFBEB', border: '0.5px solid #FDE68A', borderRadius: 10, padding: '8px 9px' }}>
                <p style={{ fontSize: 8, fontWeight: 500, color: '#92400E', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>add this</p>
                {analysis.gaps.slice(0, 1).map((g, i) => <p key={i} style={{ fontSize: 10, color: '#78350F', lineHeight: 1.4, marginBottom: 3 }}>+ {g.nudge}</p>)}
                {analysis.gaps.length === 0 && <p style={{ fontSize: 10, color: '#7A7068' }}>complete look!</p>}
              </div>
            </div>

            {/* gap cards with shop */}
            {analysis.gaps.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>style gaps</p>
                {analysis.gaps.map((gap, i) => {
                  const s = SEV_STYLE[gap.severity] ?? SEV_STYLE.opportunity
                  return (
                    <div key={i} style={{ background: s.bg, border: `0.5px solid ${s.border}`, borderRadius: 14, padding: '11px 13px', marginBottom: 9 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                        <p style={{ fontFamily: PF, fontSize: 13, fontWeight: 500, color: s.text, flex: 1 }}>{gap.nudge}</p>
                        <span style={{ fontSize: 9, background: s.border, color: s.text, padding: '2px 6px', borderRadius: 5, marginLeft: 8, flexShrink: 0 }}>{gap.severity}</span>
                      </div>
                      <p style={{ fontSize: 11, color: s.text, opacity: 0.8, lineHeight: 1.5, marginBottom: 9 }}>{gap.suggestion}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: s.text }}>₹{gap.priceRange.min.toLocaleString('en-IN')} – ₹{gap.priceRange.max.toLocaleString('en-IN')}</span>
                      </div>
                      <Link href={shopUrl(gap)} style={{ display: 'block', background: s.text, color: 'white', textAlign: 'center', padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
                        shop this gap →
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}

            {/* almari CTA */}
            <div style={{ background: M, borderRadius: 16, padding: '14px 16px', marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 430 90" preserveAspectRatio="xMidYMid slice"><rect width="430" height="90" fill="url(#bp)"/></svg>
              <div style={{ position: 'relative' }}>
                <p style={{ fontFamily: PF, fontSize: 14, color: '#F5F0E8', marginBottom: 4 }}>want this every morning, from your own wardrobe?</p>
                <p style={{ fontSize: 11, color: '#C4B0B0', marginBottom: 12, lineHeight: 1.5 }}>Almari builds outfits from what you already own, scores them, and finds what's missing — daily.</p>
                <Link href="/" style={{ display: 'inline-block', background: '#F5F0E8', color: M, fontSize: 12, fontWeight: 500, padding: '9px 18px', borderRadius: 10, textDecoration: 'none' }}>try almari free →</Link>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '6px 0 20px' }}>
              <p style={{ fontSize: 9, color: '#C4B8B0' }}>almari.app/outfit-check · no login required</p>
            </div>
          </>
        )}

        {/* social proof (when no results yet) */}
        {!analysis && !analysing && (
          <div style={{ background: 'white', border: '0.5px solid #D8D0C8', borderRadius: 14, padding: '12px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>what you get</p>
            <p style={{ fontSize: 12, color: '#1A1817', marginBottom: 5 }}>✓ honest score out of 100</p>
            <p style={{ fontSize: 12, color: '#1A1817', marginBottom: 5 }}>✓ keep / swap / add — for every piece</p>
            <p style={{ fontSize: 12, color: '#1A1817', marginBottom: 10 }}>✓ the exact fix, with shop links across Amazon, Myntra and Ajio</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '0.5px solid #EAE3D8' }}>
              <div style={{ display: 'flex' }}>
                {['#C4706F','#7A7068','#8B5E3C','#7B3030'].map((c,i) => <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: '1.5px solid #F5F0E8', marginLeft: i > 0 ? -5 : 0 }}/>)}
              </div>
              <span style={{ fontSize: 10, color: '#7A7068' }}>47,200+ looks checked · free</span>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function analysed(a: Analysis | null): boolean { return a !== null }
