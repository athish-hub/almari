'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const M  = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"
const PF = "'Playfair Display', Georgia, serif"

interface Platform {
  name: string; color: string; letter: string; badge: string | null;
  delivery: string; why: string; url: string;
}

export default function ShopContent() {
  const params    = useSearchParams()
  const [loading, setLoading]     = useState(true)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [query, setQuery]         = useState('')
  const [step, setStep]           = useState(0)

  const gapType  = params.get('gap')      ?? ''
  const category = params.get('category') ?? ''
  const colors   = params.get('colors')   ?? ''
  const formality= params.get('formality') ?? '3'
  const itemName = params.get('item') ?? category

  const steps = ['reading wardrobe context', 'searching Amazon', 'checking Myntra', 'scanning Ajio']

  useEffect(() => {
    // Step through platform checks visually
    const t1 = setTimeout(() => setStep(1), 400)
    const t2 = setTimeout(() => setStep(2), 900)
    const t3 = setTimeout(() => setStep(3), 1400)

    // Fetch real links
    fetch(`/api/shop?gap=${gapType}&category=${category}&colors=${colors}&formality=${formality}`)
      .then(r => r.json())
      .then(data => {
        setTimeout(() => {
          setQuery(data.query)
          setPlatforms(data.platforms ?? [])
          setLoading(false)
        }, 1800)
      })
      .catch(() => setLoading(false))

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '42px 20px 16px' }}>
        <Link href="javascript:history.back()" style={{ color: '#7A7068', textDecoration: 'none' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        <p style={{ fontFamily: PF, fontSize: 16, color: '#1A1817' }}>shop this gap</p>
      </div>

      {/* what we're searching */}
      <div style={{ margin: '0 16px 20px', background: '#F2E8E8', border: '0.5px solid #D4A0A0', borderRadius: 14, padding: '12px 16px' }}>
        <p style={{ fontSize: 9, color: M, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 4 }}>looking for</p>
        <p style={{ fontFamily: PF, fontSize: 16, color: '#5C2020' }}>{decodeURIComponent(itemName)}</p>
        {query && <p style={{ fontSize: 11, color: M, marginTop: 3 }}>searching: "{query}"</p>}
      </div>

      {loading ? (
        <div style={{ padding: '0 16px' }}>
          {/* step checklist */}
          <div style={{ background: '#EBE4D8', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>finding the best options</p>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: step > i ? M : 'transparent', border: step > i ? 'none' : `1.5px solid ${step === i ? '#C4706F' : '#D8D0C8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                  {step > i && <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                  {step === i && <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #C4706F', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}/>}
                </div>
                <span style={{ fontSize: 12, color: step > i ? '#1A1817' : step === i ? '#7A7068' : '#C4B8B0' }}>{s}</span>
              </div>
            ))}
          </div>
          {/* skeleton cards */}
          {[1, 0.6, 0.35].map((op, i) => (
            <div key={i} style={{ background: '#EBE4D8', borderRadius: 14, height: 88, marginBottom: 10, opacity: op, animation: 'pulse 1.4s ease-in-out infinite' }}/>
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          <p style={{ fontSize: 9, fontWeight: 500, color: '#7A7068', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>{platforms.length} options found</p>
          {platforms.map((pl, i) => (
            <div key={i} style={{ background: 'white', border: '0.5px solid #D8D0C8', borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '0.5px solid #EAE3D8' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: pl.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{pl.letter}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1817' }}>{pl.name}</p>
                  <p style={{ fontSize: 10, color: '#7A7068', marginTop: 1 }}>{pl.delivery}</p>
                </div>
                {pl.badge && <span style={{ fontSize: 9, background: '#E1F5EE', color: '#085041', padding: '2px 7px', borderRadius: 6, fontWeight: 500 }}>{pl.badge}</span>}
              </div>
              <div style={{ padding: '10px 14px' }}>
                <p style={{ fontSize: 11, color: '#7A7068', marginBottom: 10, lineHeight: 1.5 }}>{pl.why}</p>
                <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: pl.color, color: 'white', fontSize: 12, fontWeight: 500, padding: '9px', borderRadius: 9, textAlign: 'center', textDecoration: 'none' }}>
                  shop on {pl.name} →
                </a>
              </div>
            </div>
          ))}
          <div style={{ background: '#F2E8E8', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: M, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" stroke="#F5F0E8" strokeWidth="1.7" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#5C2020' }}>want almari to find this for you every day?</p>
              <Link href="/" style={{ fontSize: 10, color: M, textDecoration: 'none' }}>try almari free →</Link>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 9, color: '#C4B8B0', paddingBottom: 20 }}>powered by almari · prices are approximate · amazon links are affiliated</p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
      `}</style>
    </div>
  )
}
