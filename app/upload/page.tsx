'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ColorName, GarmentCategory, PatternType, FabricWeight, TopSilhouette, BottomSilhouette, OccasionTag } from '@/lib/types'

const CATEGORIES: { value: GarmentCategory; label: string }[] = [
  { value: 'top', label: 'top' },{ value: 'bottom', label: 'bottom' },{ value: 'full-body', label: 'full body' },
  { value: 'outerwear', label: 'outerwear' },{ value: 'footwear', label: 'footwear' },
  { value: 'accessory', label: 'accessory' },{ value: 'dupatta', label: 'dupatta' },
]

const SUBTYPES: Record<GarmentCategory, { value: string; label: string }[]> = {
  top: [{ value: 't-shirt', label: 't-shirt' },{ value: 'shirt', label: 'shirt' },{ value: 'blouse', label: 'blouse' },{ value: 'crop-top', label: 'crop top' },{ value: 'kurti', label: 'kurti' },{ value: 'kurta', label: 'kurta' },{ value: 'sweatshirt', label: 'sweatshirt' },{ value: 'hoodie', label: 'hoodie' },{ value: 'tank', label: 'tank / vest' },{ value: 'corset-top', label: 'corset top' }],
  bottom: [{ value: 'jeans', label: 'jeans' },{ value: 'trousers', label: 'trousers' },{ value: 'chinos', label: 'chinos' },{ value: 'shorts', label: 'shorts' },{ value: 'skirt-mini', label: 'mini skirt' },{ value: 'skirt-midi', label: 'midi skirt' },{ value: 'skirt-maxi', label: 'maxi skirt' },{ value: 'palazzo', label: 'palazzo' },{ value: 'salwar', label: 'salwar' },{ value: 'leggings', label: 'leggings' },{ value: 'wide-leg', label: 'wide leg' },{ value: 'dhoti-pants', label: 'dhoti pants' }],
  'full-body': [{ value: 'dress-mini', label: 'mini dress' },{ value: 'dress-midi', label: 'midi dress' },{ value: 'dress-maxi', label: 'maxi dress' },{ value: 'jumpsuit', label: 'jumpsuit' },{ value: 'saree', label: 'saree' },{ value: 'lehenga', label: 'lehenga' },{ value: 'anarkali', label: 'anarkali' },{ value: 'sharara-set', label: 'sharara set' },{ value: 'co-ord-set', label: 'co-ord set' }],
  outerwear: [{ value: 'blazer', label: 'blazer' },{ value: 'jacket-denim', label: 'denim jacket' },{ value: 'jacket-leather', label: 'leather jacket' },{ value: 'jacket-bomber', label: 'bomber' },{ value: 'cardigan', label: 'cardigan' },{ value: 'shawl', label: 'shawl' },{ value: 'overcoat', label: 'overcoat' },{ value: 'trench', label: 'trench coat' }],
  footwear: [{ value: 'sneakers', label: 'sneakers' },{ value: 'loafers', label: 'loafers' },{ value: 'oxfords', label: 'oxfords' },{ value: 'heels-block', label: 'block heels' },{ value: 'heels-stiletto', label: 'stilettos' },{ value: 'mules', label: 'mules' },{ value: 'kolhapuris', label: 'kolhapuris' },{ value: 'juttis', label: 'juttis' },{ value: 'sandals-flat', label: 'flat sandals' },{ value: 'sandals-heeled', label: 'heeled sandals' },{ value: 'chelsea-boots', label: 'chelsea boots' },{ value: 'boots-ankle', label: 'ankle boots' },{ value: 'slides', label: 'slides' },{ value: 'flats', label: 'flats' }],
  accessory: [{ value: 'belt', label: 'belt' },{ value: 'watch', label: 'watch' },{ value: 'bag-tote', label: 'tote bag' },{ value: 'bag-clutch', label: 'clutch' },{ value: 'bag-sling', label: 'sling bag' },{ value: 'bag-structured', label: 'structured bag' },{ value: 'necklace', label: 'necklace' },{ value: 'earrings', label: 'earrings' },{ value: 'bangles', label: 'bangles' },{ value: 'sunglasses', label: 'sunglasses' },{ value: 'scarf', label: 'scarf' },{ value: 'hat', label: 'hat' },{ value: 'potli', label: 'potli' }],
  dupatta: [{ value: 'dupatta', label: 'dupatta' }],
}

const COLORS: { name: ColorName; hex: string }[] = [
  { name: 'white', hex: '#FAFAFA' },{ name: 'off-white', hex: '#F5F0E8' },{ name: 'cream', hex: '#FFF8DC' },
  { name: 'black', hex: '#1A1A1A' },{ name: 'charcoal', hex: '#36454F' },{ name: 'grey-light', hex: '#D3D3D3' },
  { name: 'grey-medium', hex: '#9E9E9E' },{ name: 'grey-dark', hex: '#616161' },{ name: 'navy', hex: '#1B2A4A' },
  { name: 'camel', hex: '#C19A6B' },{ name: 'tan', hex: '#D2B48C' },{ name: 'beige', hex: '#F5F0DC' },
  { name: 'brown', hex: '#8B5E3C' },{ name: 'red', hex: '#C0392B' },{ name: 'crimson', hex: '#DC143C' },
  { name: 'burgundy', hex: '#800020' },{ name: 'maroon', hex: '#800000' },{ name: 'coral', hex: '#FF6B6B' },
  { name: 'terracotta', hex: '#C26A4E' },{ name: 'rust', hex: '#B7410E' },{ name: 'orange', hex: '#E67E22' },
  { name: 'yellow', hex: '#F4D03F' },{ name: 'mustard', hex: '#DFAF2C' },{ name: 'gold', hex: '#D4AF37' },
  { name: 'olive', hex: '#808000' },{ name: 'green', hex: '#27AE60' },{ name: 'emerald', hex: '#046307' },
  { name: 'sage', hex: '#B2AC88' },{ name: 'teal', hex: '#008080' },{ name: 'blue-light', hex: '#AED6F1' },
  { name: 'blue-sky', hex: '#87CEEB' },{ name: 'blue-royal', hex: '#2255A4' },{ name: 'indigo', hex: '#3F51B5' },
  { name: 'pink', hex: '#F48FB1' },{ name: 'blush', hex: '#F2C4CE' },{ name: 'rose', hex: '#E8A0BF' },
  { name: 'hot-pink', hex: '#FF69B4' },{ name: 'fuchsia', hex: '#C2185B' },{ name: 'purple', hex: '#7B1FA2' },
  { name: 'lavender', hex: '#E6E6FA' },{ name: 'plum', hex: '#4A0E4E' },{ name: 'saffron', hex: '#FF9933' },
  { name: 'marigold', hex: '#FFA500' },{ name: 'peacock', hex: '#006994' },{ name: 'rani-pink', hex: '#E75480' },
  { name: 'multicolor', hex: '#E0E0E0' },
]

const PATTERNS: { value: PatternType; label: string }[] = [
  { value: 'solid', label: 'solid' },{ value: 'stripes-thin', label: 'thin stripes' },{ value: 'stripes-bold', label: 'bold stripes' },
  { value: 'checks-small', label: 'small checks' },{ value: 'checks-bold', label: 'bold checks' },
  { value: 'floral-small', label: 'small floral' },{ value: 'floral-large', label: 'large floral' },
  { value: 'geometric', label: 'geometric' },{ value: 'abstract', label: 'abstract' },
  { value: 'animal-print', label: 'animal print' },{ value: 'ethnic-print', label: 'ethnic print' },
  { value: 'embroidered', label: 'embroidered' },{ value: 'tie-dye', label: 'tie dye' },{ value: 'sequinned', label: 'sequinned' },
]

const FABRIC_WEIGHTS: { value: FabricWeight; label: string }[] = [
  { value: 'sheer', label: 'sheer' },{ value: 'light', label: 'light' },{ value: 'medium', label: 'medium' },
  { value: 'heavy', label: 'heavy' },{ value: 'structured', label: 'structured' },
]

const OCCASIONS: { value: OccasionTag; label: string }[] = [
  { value: 'casual', label: 'casual' },{ value: 'college', label: 'college' },{ value: 'office', label: 'office' },
  { value: 'smart-casual', label: 'smart casual' },{ value: 'brunch', label: 'brunch' },{ value: 'date-night', label: 'date night' },
  { value: 'festive', label: 'festive' },{ value: 'wedding-guest', label: 'wedding guest' },
  { value: 'wedding-function', label: 'wedding function' },{ value: 'party-night', label: 'party' },
  { value: 'travel', label: 'travel' },{ value: 'sport', label: 'sport' },{ value: 'loungewear', label: 'loungewear' },
]

const TOP_SILHOUETTES: { value: TopSilhouette; label: string }[] = [
  { value: 'fitted', label: 'fitted' },{ value: 'semi-fitted', label: 'semi-fitted' },{ value: 'relaxed', label: 'relaxed' },
  { value: 'oversized', label: 'oversized' },{ value: 'cropped', label: 'cropped' },{ value: 'structured', label: 'structured' },
]

const BOTTOM_SILHOUETTES: { value: BottomSilhouette; label: string }[] = [
  { value: 'skinny', label: 'skinny' },{ value: 'slim', label: 'slim' },{ value: 'straight', label: 'straight' },
  { value: 'wide-leg', label: 'wide leg' },{ value: 'flared', label: 'flared' },{ value: 'a-line', label: 'a-line' },
  { value: 'pleated', label: 'pleated' },{ value: 'draped', label: 'draped' },
]

const FORMALITY_LABELS: Record<number, string> = {
  1: 'athleisure', 2: 'casual', 3: 'smart casual', 4: 'semi-formal', 5: 'formal',
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

// ── Design tokens ──────────────────────────────────────────────
const M  = '#7B3030'
const SF = "system-ui, -apple-system, sans-serif"

const chipStyle = (on: boolean) => ({
  display: 'inline-flex' as const, alignItems: 'center' as const,
  padding: '5px 11px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
  border: on ? 'none' : '0.5px solid #D8D0C8',
  background: on ? M : 'white', color: on ? '#F5F0E8' : '#374151',
  fontFamily: SF, margin: '2px 3px 0 0',
})

const sectionLabel = (extra?: string) => ({
  fontSize: 9, fontWeight: 500 as const, color: '#7A7068',
  letterSpacing: '1.2px', textTransform: 'uppercase' as const,
  marginBottom: 8, fontFamily: SF, ...(extra ? {} : {}),
})

const fieldWrap = { padding: '11px 16px', borderBottom: '0.5px solid #EAE3D8', background: '#F5F0E8' }

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [analysed, setAnalysed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '', category: '' as GarmentCategory | '', subtype: '',
    primaryColor: '' as ColorName | '', pattern: 'solid' as PatternType,
    fabricWeight: 'medium' as FabricWeight, formality: 3,
    topSilhouette: '' as TopSilhouette | '', bottomSilhouette: '' as BottomSilhouette | '',
    occasions: [] as OccasionTag[],
  })

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const original = reader.result as string
      setPreview(original); setAnalysed(false)
      await runAnalysis(original, file.type)
    }
    reader.readAsDataURL(file)
  }

  async function runAnalysis(dataUrl: string, mimeType: string) {
    setAnalysing(true); setError(null)
    try {
      const resized = await resizeBase64(dataUrl)
      const res = await fetch('/api/analyse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: resized, mimeType: 'image/jpeg' }) })
      if (!res.ok) throw new Error('analysis failed')
      const data = await res.json()
      setForm(prev => ({
        ...prev,
        name: data.name ?? prev.name, category: data.category ?? prev.category,
        subtype: data.subtype ?? prev.subtype, primaryColor: data.primaryColor ?? prev.primaryColor,
        pattern: data.pattern ?? prev.pattern, fabricWeight: data.fabricWeight ?? prev.fabricWeight,
        formality: data.formality ?? prev.formality, topSilhouette: data.topSilhouette ?? prev.topSilhouette,
        bottomSilhouette: data.bottomSilhouette ?? prev.bottomSilhouette,
        occasions: Array.isArray(data.occasions) && data.occasions.length > 0 ? data.occasions : prev.occasions,
      }))
      setAnalysed(true)
    } catch { setError('auto-tagging failed — fill in manually below') }
    finally { setAnalysing(false) }
  }

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => { const next = { ...prev, [key]: value }; if (key === 'category') next.subtype = ''; return next })
  }

  function toggleOccasion(occ: OccasionTag) {
    set('occasions', form.occasions.includes(occ) ? form.occasions.filter(o => o !== occ) : [...form.occasions, occ])
  }

  const canSave = form.name && form.category && form.subtype && form.primaryColor && form.occasions.length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true); setError(null)
    try {
      const photoToSave = preview ? await resizeBase64(preview, 800) : null
      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, photoUrl: photoToSave, patternScale: form.pattern === 'solid' ? 'none' : 'medium', fabricTexture: 'matte', secondaryColor: null }) })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error ?? 'failed to save') }
      router.push('/wardrobe')
    } catch (e: any) { setError(e.message ?? 'something went wrong — try again'); setSaving(false) }
  }

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', maxWidth: 430, margin: '0 auto', fontFamily: SF, paddingBottom: 100 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '42px 16px 12px', borderBottom: '0.5px solid #EAE3D8' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: '#7A7068', cursor: 'pointer', padding: 4 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#1A1817', flex: 1 }}>add a piece</span>
        {analysed && <span style={{ fontSize: 9, padding: '3px 9px', borderRadius: 8, background: '#E1F5EE', color: '#085041', fontFamily: SF }}>✓ auto-tagged</span>}
      </div>

      {/* photo zone */}
      <div style={{ margin: '12px 16px', borderRadius: 14, overflow: 'hidden', position: 'relative', cursor: analysing ? 'default' : 'pointer' }}
        onClick={() => !analysing && fileRef.current?.click()}>
        {!preview ? (
          <div style={{ height: 150, background: '#EBE4D8', border: '0.5px solid #D8D0C8', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="28" height="28" fill="none" stroke="#C4B8B0" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span style={{ fontSize: 13, color: '#7A7068' }}>tap to add photo</span>
            <span style={{ fontSize: 10, color: '#C4706F' }}>almari will auto-tag it</span>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: analysed ? 120 : 260, objectFit: 'cover', display: 'block', transition: 'max-height 0.3s ease' }}/>
            {analysing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,24,23,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', border: '2.5px solid rgba(245,240,232,0.25)', borderTopColor: '#F5F0E8', animation: 'spin 0.85s linear infinite' }}/>
                <p style={{ fontSize: 14, color: '#F5F0E8', fontFamily: SF }}>reading your piece...</p>
                <p style={{ fontSize: 10, color: 'rgba(245,240,232,0.6)', fontFamily: SF }}>colour · pattern · formality · occasions</p>
              </div>
            )}
            {!analysing && (
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(26,24,23,0.55)', color: 'white', fontSize: 10, padding: '4px 10px', borderRadius: 7, fontFamily: SF }}>
                tap to change
              </div>
            )}
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />

      {error && (
        <div style={{ margin: '0 16px 10px', padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '0.5px solid #FECACA' }}>
          <p style={{ fontSize: 12, color: '#991B1B', fontFamily: SF }}>{error}</p>
        </div>
      )}

      {/* form */}
      <div style={{ opacity: analysing ? 0.4 : 1, pointerEvents: analysing ? 'none' : 'auto' }}>

        <div style={fieldWrap}>
          <div style={sectionLabel()}>name</div>
          <input type="text" placeholder="e.g. white linen shirt" value={form.name} onChange={e => set('name', e.target.value)}
            style={{ width: '100%', borderRadius: 10, border: '0.5px solid #D8D0C8', padding: '10px 13px', fontSize: 13, color: '#1A1817', background: 'white', outline: 'none', fontFamily: SF, boxSizing: 'border-box' }}/>
        </div>

        <div style={fieldWrap}>
          <div style={sectionLabel()}>category</div>
          <div>{CATEGORIES.map(c => <button key={c.value} onClick={() => set('category', c.value)} style={chipStyle(form.category === c.value)}>{c.label}</button>)}</div>
        </div>

        {form.category && (
          <div style={fieldWrap}>
            <div style={sectionLabel()}>type</div>
            <div>{SUBTYPES[form.category].map(s => <button key={s.value} onClick={() => set('subtype', s.value)} style={chipStyle(form.subtype === s.value)}>{s.label}</button>)}</div>
          </div>
        )}

        <div style={fieldWrap}>
          <div style={sectionLabel()}>
            colour {form.primaryColor && <span style={{ color: M, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— {form.primaryColor}</span>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {COLORS.map(c => (
              <button key={c.name} title={c.name} onClick={() => set('primaryColor', c.name)}
                style={{ width: 26, height: 26, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer', flexShrink: 0, outline: form.primaryColor === c.name ? `2.5px solid ${M}` : 'none', outlineOffset: 2, boxShadow: ['white','off-white','cream','lavender','beige'].includes(c.name) ? 'inset 0 0 0 1px #D8D0C8' : 'none' }}/>
            ))}
          </div>
        </div>

        <div style={fieldWrap}>
          <div style={sectionLabel()}>pattern</div>
          <div>{PATTERNS.map(p => <button key={p.value} onClick={() => set('pattern', p.value)} style={chipStyle(form.pattern === p.value)}>{p.label}</button>)}</div>
        </div>

        <div style={fieldWrap}>
          <div style={sectionLabel()}>fabric weight</div>
          <div>{FABRIC_WEIGHTS.map(f => <button key={f.value} onClick={() => set('fabricWeight', f.value)} style={chipStyle(form.fabricWeight === f.value)}>{f.label}</button>)}</div>
        </div>

        <div style={fieldWrap}>
          <div style={sectionLabel()}>
            formality — <span style={{ color: M, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{FORMALITY_LABELS[form.formality]}</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={form.formality} onChange={e => set('formality', Number(e.target.value))} style={{ width: '100%', accentColor: M, marginBottom: 4 }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#7A7068', fontFamily: SF }}>
            <span>athleisure</span><span>casual</span><span>smart</span><span>semi</span><span>formal</span>
          </div>
        </div>

        {form.category === 'top' && (
          <div style={fieldWrap}>
            <div style={sectionLabel()}>silhouette</div>
            <div>{TOP_SILHOUETTES.map(s => <button key={s.value} onClick={() => set('topSilhouette', s.value)} style={chipStyle(form.topSilhouette === s.value)}>{s.label}</button>)}</div>
          </div>
        )}

        {form.category === 'bottom' && (
          <div style={fieldWrap}>
            <div style={sectionLabel()}>silhouette</div>
            <div>{BOTTOM_SILHOUETTES.map(s => <button key={s.value} onClick={() => set('bottomSilhouette', s.value)} style={chipStyle(form.bottomSilhouette === s.value)}>{s.label}</button>)}</div>
          </div>
        )}

        <div style={{ ...fieldWrap, borderBottom: 'none' }}>
          <div style={sectionLabel()}>occasions</div>
          <div>{OCCASIONS.map(o => <button key={o.value} onClick={() => toggleOccasion(o.value)} style={chipStyle(form.occasions.includes(o.value))}>{o.label}</button>)}</div>
        </div>

      </div>

      {/* save button */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 16px 28px', background: '#F5F0E8', borderTop: '0.5px solid #EAE3D8' }}>
        <button onClick={handleSave} disabled={!canSave || saving || analysing}
          style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: canSave && !saving && !analysing ? 'pointer' : 'not-allowed', background: M, color: '#F5F0E8', fontSize: 13, fontWeight: 500, fontFamily: SF, opacity: canSave && !saving && !analysing ? 1 : 0.35 }}>
          {analysing ? 'analysing...' : saving ? 'saving...' : 'save to wardrobe'}
        </button>
        {!canSave && !analysing && (
          <p style={{ fontSize: 10, color: '#7A7068', textAlign: 'center', marginTop: 6, fontFamily: SF }}>fill in name, category, type, colour and at least one occasion</p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
