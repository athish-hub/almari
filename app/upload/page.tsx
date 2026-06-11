'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ColorName, GarmentCategory, PatternType, FabricWeight, TopSilhouette, BottomSilhouette, OccasionTag } from '@/lib/types'

// ── Constants ──────────────────────────────────────────────────

const CATEGORIES: { value: GarmentCategory; label: string }[] = [
  { value: 'top', label: 'top' },
  { value: 'bottom', label: 'bottom' },
  { value: 'full-body', label: 'full body' },
  { value: 'outerwear', label: 'outerwear' },
  { value: 'footwear', label: 'footwear' },
  { value: 'accessory', label: 'accessory' },
  { value: 'dupatta', label: 'dupatta' },
]

const SUBTYPES: Record<GarmentCategory, { value: string; label: string }[]> = {
  top: [
    { value: 't-shirt', label: 't-shirt' }, { value: 'shirt', label: 'shirt' },
    { value: 'blouse', label: 'blouse' }, { value: 'crop-top', label: 'crop top' },
    { value: 'kurti', label: 'kurti' }, { value: 'kurta', label: 'kurta' },
    { value: 'sweatshirt', label: 'sweatshirt' }, { value: 'hoodie', label: 'hoodie' },
    { value: 'tank', label: 'tank / vest' }, { value: 'corset-top', label: 'corset top' },
  ],
  bottom: [
    { value: 'jeans', label: 'jeans' }, { value: 'trousers', label: 'trousers' },
    { value: 'chinos', label: 'chinos' }, { value: 'shorts', label: 'shorts' },
    { value: 'skirt-mini', label: 'mini skirt' }, { value: 'skirt-midi', label: 'midi skirt' },
    { value: 'skirt-maxi', label: 'maxi skirt' }, { value: 'palazzo', label: 'palazzo' },
    { value: 'salwar', label: 'salwar' }, { value: 'leggings', label: 'leggings' },
    { value: 'wide-leg', label: 'wide leg' }, { value: 'dhoti-pants', label: 'dhoti pants' },
  ],
  'full-body': [
    { value: 'dress-mini', label: 'mini dress' }, { value: 'dress-midi', label: 'midi dress' },
    { value: 'dress-maxi', label: 'maxi dress' }, { value: 'jumpsuit', label: 'jumpsuit' },
    { value: 'saree', label: 'saree' }, { value: 'lehenga', label: 'lehenga' },
    { value: 'anarkali', label: 'anarkali' }, { value: 'sharara-set', label: 'sharara set' },
    { value: 'co-ord-set', label: 'co-ord set' },
  ],
  outerwear: [
    { value: 'blazer', label: 'blazer' }, { value: 'jacket-denim', label: 'denim jacket' },
    { value: 'jacket-leather', label: 'leather jacket' }, { value: 'jacket-bomber', label: 'bomber' },
    { value: 'cardigan', label: 'cardigan' }, { value: 'shawl', label: 'shawl' },
    { value: 'overcoat', label: 'overcoat' }, { value: 'trench', label: 'trench coat' },
  ],
  footwear: [
    { value: 'sneakers', label: 'sneakers' }, { value: 'loafers', label: 'loafers' },
    { value: 'oxfords', label: 'oxfords' }, { value: 'heels-block', label: 'block heels' },
    { value: 'heels-stiletto', label: 'stilettos' }, { value: 'mules', label: 'mules' },
    { value: 'kolhapuris', label: 'kolhapuris' }, { value: 'juttis', label: 'juttis' },
    { value: 'sandals-flat', label: 'flat sandals' }, { value: 'sandals-heeled', label: 'heeled sandals' },
    { value: 'chelsea-boots', label: 'chelsea boots' }, { value: 'boots-ankle', label: 'ankle boots' },
    { value: 'slides', label: 'slides' }, { value: 'flats', label: 'flats' },
  ],
  accessory: [
    { value: 'belt', label: 'belt' }, { value: 'watch', label: 'watch' },
    { value: 'bag-tote', label: 'tote bag' }, { value: 'bag-clutch', label: 'clutch' },
    { value: 'bag-sling', label: 'sling bag' }, { value: 'bag-structured', label: 'structured bag' },
    { value: 'necklace', label: 'necklace' }, { value: 'earrings', label: 'earrings' },
    { value: 'bangles', label: 'bangles' }, { value: 'sunglasses', label: 'sunglasses' },
    { value: 'scarf', label: 'scarf' }, { value: 'hat', label: 'hat' }, { value: 'potli', label: 'potli' },
  ],
  dupatta: [{ value: 'dupatta', label: 'dupatta' }],
}

const COLORS: { name: ColorName; hex: string; label: string }[] = [
  { name: 'white', hex: '#FAFAFA', label: 'white' }, { name: 'off-white', hex: '#F5F0E8', label: 'off-white' },
  { name: 'cream', hex: '#FFF8DC', label: 'cream' }, { name: 'black', hex: '#1A1A1A', label: 'black' },
  { name: 'charcoal', hex: '#36454F', label: 'charcoal' }, { name: 'grey-light', hex: '#D3D3D3', label: 'light grey' },
  { name: 'grey-medium', hex: '#9E9E9E', label: 'grey' }, { name: 'grey-dark', hex: '#616161', label: 'dark grey' },
  { name: 'navy', hex: '#1B2A4A', label: 'navy' }, { name: 'camel', hex: '#C19A6B', label: 'camel' },
  { name: 'tan', hex: '#D2B48C', label: 'tan' }, { name: 'beige', hex: '#F5F0DC', label: 'beige' },
  { name: 'brown', hex: '#8B5E3C', label: 'brown' }, { name: 'red', hex: '#C0392B', label: 'red' },
  { name: 'crimson', hex: '#DC143C', label: 'crimson' }, { name: 'burgundy', hex: '#800020', label: 'burgundy' },
  { name: 'maroon', hex: '#800000', label: 'maroon' }, { name: 'coral', hex: '#FF6B6B', label: 'coral' },
  { name: 'terracotta', hex: '#C26A4E', label: 'terracotta' }, { name: 'rust', hex: '#B7410E', label: 'rust' },
  { name: 'orange', hex: '#E67E22', label: 'orange' }, { name: 'yellow', hex: '#F4D03F', label: 'yellow' },
  { name: 'mustard', hex: '#DFAF2C', label: 'mustard' }, { name: 'gold', hex: '#D4AF37', label: 'gold' },
  { name: 'olive', hex: '#808000', label: 'olive' }, { name: 'green', hex: '#27AE60', label: 'green' },
  { name: 'emerald', hex: '#046307', label: 'emerald' }, { name: 'sage', hex: '#B2AC88', label: 'sage' },
  { name: 'teal', hex: '#008080', label: 'teal' }, { name: 'blue-light', hex: '#AED6F1', label: 'light blue' },
  { name: 'blue-sky', hex: '#87CEEB', label: 'sky blue' }, { name: 'blue-royal', hex: '#2255A4', label: 'royal blue' },
  { name: 'indigo', hex: '#3F51B5', label: 'indigo' }, { name: 'pink', hex: '#F48FB1', label: 'pink' },
  { name: 'blush', hex: '#F2C4CE', label: 'blush' }, { name: 'rose', hex: '#E8A0BF', label: 'rose' },
  { name: 'hot-pink', hex: '#FF69B4', label: 'hot pink' }, { name: 'fuchsia', hex: '#C2185B', label: 'fuchsia' },
  { name: 'purple', hex: '#7B1FA2', label: 'purple' }, { name: 'lavender', hex: '#E6E6FA', label: 'lavender' },
  { name: 'plum', hex: '#4A0E4E', label: 'plum' }, { name: 'saffron', hex: '#FF9933', label: 'saffron' },
  { name: 'marigold', hex: '#FFA500', label: 'marigold' }, { name: 'peacock', hex: '#006994', label: 'peacock' },
  { name: 'rani-pink', hex: '#E75480', label: 'rani pink' },
  { name: 'multicolor', hex: '#E0E0E0', label: 'multi' },
]

const PATTERNS: { value: PatternType; label: string }[] = [
  { value: 'solid', label: 'solid' }, { value: 'stripes-thin', label: 'thin stripes' },
  { value: 'stripes-bold', label: 'bold stripes' }, { value: 'checks-small', label: 'small checks' },
  { value: 'checks-bold', label: 'bold checks' }, { value: 'floral-small', label: 'small floral' },
  { value: 'floral-large', label: 'large floral' }, { value: 'geometric', label: 'geometric' },
  { value: 'abstract', label: 'abstract' }, { value: 'animal-print', label: 'animal print' },
  { value: 'ethnic-print', label: 'ethnic print' }, { value: 'embroidered', label: 'embroidered' },
  { value: 'tie-dye', label: 'tie dye' }, { value: 'sequinned', label: 'sequinned' },
]

const FABRIC_WEIGHTS: { value: FabricWeight; label: string; desc: string }[] = [
  { value: 'sheer', label: 'sheer', desc: 'chiffon, georgette' },
  { value: 'light', label: 'light', desc: 'cotton, linen' },
  { value: 'medium', label: 'medium', desc: 'crepe, poplin' },
  { value: 'heavy', label: 'heavy', desc: 'denim, velvet' },
  { value: 'structured', label: 'structured', desc: 'blazer, coat' },
]

const OCCASIONS: { value: OccasionTag; label: string }[] = [
  { value: 'casual', label: 'casual' }, { value: 'college', label: 'college' },
  { value: 'office', label: 'office' }, { value: 'smart-casual', label: 'smart casual' },
  { value: 'brunch', label: 'brunch' }, { value: 'date-night', label: 'date night' },
  { value: 'festive', label: 'festive' }, { value: 'wedding-guest', label: 'wedding guest' },
  { value: 'wedding-function', label: 'wedding function' }, { value: 'party-night', label: 'party' },
  { value: 'travel', label: 'travel' }, { value: 'sport', label: 'sport' },
  { value: 'loungewear', label: 'loungewear' },
]

const TOP_SILHOUETTES: { value: TopSilhouette; label: string }[] = [
  { value: 'fitted', label: 'fitted' }, { value: 'semi-fitted', label: 'semi-fitted' },
  { value: 'relaxed', label: 'relaxed' }, { value: 'oversized', label: 'oversized' },
  { value: 'cropped', label: 'cropped' }, { value: 'structured', label: 'structured' },
]

const BOTTOM_SILHOUETTES: { value: BottomSilhouette; label: string }[] = [
  { value: 'skinny', label: 'skinny' }, { value: 'slim', label: 'slim' },
  { value: 'straight', label: 'straight' }, { value: 'wide-leg', label: 'wide leg' },
  { value: 'flared', label: 'flared' }, { value: 'a-line', label: 'a-line' },
  { value: 'pleated', label: 'pleated' }, { value: 'draped', label: 'draped' },
]

const FORMALITY_LABELS: Record<number, string> = {
  1: 'athleisure', 2: 'casual', 3: 'smart casual', 4: 'semi-formal', 5: 'formal',
}

// ── Helpers ────────────────────────────────────────────────────

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

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [analysed, setAnalysed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    category: '' as GarmentCategory | '',
    subtype: '',
    primaryColor: '' as ColorName | '',
    pattern: 'solid' as PatternType,
    fabricWeight: 'medium' as FabricWeight,
    formality: 3,
    topSilhouette: '' as TopSilhouette | '',
    bottomSilhouette: '' as BottomSilhouette | '',
    occasions: [] as OccasionTag[],
  })

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const original = reader.result as string
      setPreview(original)
      await runAnalysis(original, file.type)
    }
    reader.readAsDataURL(file)
  }

  async function runAnalysis(dataUrl: string, mimeType: string) {
    setAnalysing(true)
    setError(null)
    try {
      const resized = await resizeBase64(dataUrl)
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: resized, mimeType: 'image/jpeg' }),
      })
      if (!res.ok) throw new Error('analysis failed')
      const data = await res.json()

      setForm(prev => ({
        ...prev,
        name: data.name ?? prev.name,
        category: data.category ?? prev.category,
        subtype: data.subtype ?? prev.subtype,
        primaryColor: data.primaryColor ?? prev.primaryColor,
        pattern: data.pattern ?? prev.pattern,
        fabricWeight: data.fabricWeight ?? prev.fabricWeight,
        formality: data.formality ?? prev.formality,
        topSilhouette: data.topSilhouette ?? prev.topSilhouette,
        bottomSilhouette: data.bottomSilhouette ?? prev.bottomSilhouette,
        occasions: Array.isArray(data.occasions) && data.occasions.length > 0
          ? data.occasions
          : prev.occasions,
      }))
      setAnalysed(true)
    } catch {
      setError('auto-tagging failed — fill in manually below')
    } finally {
      setAnalysing(false)
    }
  }

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'category') next.subtype = ''
      return next
    })
  }

  function toggleOccasion(occ: OccasionTag) {
    set('occasions', form.occasions.includes(occ)
      ? form.occasions.filter(o => o !== occ)
      : [...form.occasions, occ])
  }

  const canSave = form.name && form.category && form.subtype && form.primaryColor && form.occasions.length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      // Resize photo to max 800px before saving — prevents Vercel 4.5MB body limit error
      const photoToSave = preview ? await resizeBase64(preview, 800) : null
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photoUrl: photoToSave,
          patternScale: form.pattern === 'solid' ? 'none' : 'medium',
          fabricTexture: 'matte',
          secondaryColor: null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'failed to save')
      }
      router.push('/wardrobe')
    } catch (e: any) {
      setError(e.message ?? 'something went wrong — try again')
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 pt-8 pb-32">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-lg font-medium text-gray-900">add a piece</h1>
        {analysed && (
          <span className="ml-auto text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
            ✓ auto-tagged
          </span>
        )}
      </div>

      {/* Photo upload */}
      <div
        onClick={() => !analysing && fileRef.current?.click()}
        className="relative mb-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{ minHeight: preview ? 'auto' : 160 }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full max-h-72 object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-8 text-gray-300">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="text-sm">tap to add photo</span>
            <span className="text-xs">almari will auto-tag it</span>
          </div>
        )}

        {/* Analysing overlay */}
        {analysing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(255,255,255,0.88)' }}>
            <div className="w-10 h-10 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
            <p className="text-sm font-medium" style={{ color: '#534AB7' }}>reading your piece...</p>
            <p className="text-xs text-gray-400">colour · pattern · formality · occasions</p>
          </div>
        )}

        {/* Re-upload hint when done */}
        {preview && !analysing && (
          <div className="absolute top-2 right-2">
            <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-lg">tap to change</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-100 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form — shown immediately, populated after analysis */}
      <div className={analysing ? 'opacity-40 pointer-events-none' : ''}>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">name</label>
          <input
            type="text"
            placeholder="e.g. white linen shirt"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => set('category', c.value)}
                className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                style={form.category === c.value
                  ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                  : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtype */}
        {form.category && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">type</label>
            <div className="flex flex-wrap gap-2">
              {SUBTYPES[form.category].map(s => (
                <button key={s.value} onClick={() => set('subtype', s.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                  style={form.subtype === s.value
                    ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                    : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            color {form.primaryColor && <span className="normal-case font-normal" style={{ color: '#534AB7' }}>— {form.primaryColor}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c.name} onClick={() => set('primaryColor', c.name)} title={c.label}
                className="w-8 h-8 rounded-full border-2 transition-all flex-shrink-0"
                style={{
                  background: c.hex,
                  borderColor: form.primaryColor === c.name ? '#534AB7' : 'transparent',
                  outline: form.primaryColor === c.name ? '2px solid #534AB7' : 'none',
                  outlineOffset: 2,
                  boxShadow: c.name === 'white' || c.name === 'off-white' || c.name === 'cream' || c.name === 'lavender'
                    ? 'inset 0 0 0 1px #e5e7eb' : 'none',
                }} />
            ))}
          </div>
        </div>

        {/* Pattern */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">pattern</label>
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map(p => (
              <button key={p.value} onClick={() => set('pattern', p.value)}
                className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                style={form.pattern === p.value
                  ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                  : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric weight */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">fabric weight</label>
          <div className="flex flex-wrap gap-2">
            {FABRIC_WEIGHTS.map(f => (
              <button key={f.value} onClick={() => set('fabricWeight', f.value)} title={f.desc}
                className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                style={form.fabricWeight === f.value
                  ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                  : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formality */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            formality — <span className="normal-case font-normal" style={{ color: '#534AB7' }}>{FORMALITY_LABELS[form.formality]}</span>
          </label>
          <input type="range" min={1} max={5} step={1} value={form.formality}
            onChange={e => set('formality', Number(e.target.value))}
            className="w-full accent-violet-600" />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>athleisure</span><span>casual</span><span>smart</span><span>semi</span><span>formal</span>
          </div>
        </div>

        {/* Silhouette — top */}
        {form.category === 'top' && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">silhouette</label>
            <div className="flex flex-wrap gap-2">
              {TOP_SILHOUETTES.map(s => (
                <button key={s.value} onClick={() => set('topSilhouette', s.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                  style={form.topSilhouette === s.value
                    ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                    : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Silhouette — bottom */}
        {form.category === 'bottom' && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">silhouette</label>
            <div className="flex flex-wrap gap-2">
              {BOTTOM_SILHOUETTES.map(s => (
                <button key={s.value} onClick={() => set('bottomSilhouette', s.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                  style={form.bottomSilhouette === s.value
                    ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                    : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Occasions */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">occasions</label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map(o => (
              <button key={o.value} onClick={() => toggleOccasion(o.value)}
                className="px-3 py-1.5 rounded-lg text-sm border transition-all"
                style={form.occasions.includes(o.value)
                  ? { background: '#534AB7', color: 'white', borderColor: '#534AB7' }
                  : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-md mx-auto">
        <button
          onClick={handleSave}
          disabled={!canSave || saving || analysing}
          className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-opacity"
          style={{ background: '#534AB7', opacity: canSave && !saving && !analysing ? 1 : 0.4 }}>
          {analysing ? 'analysing...' : saving ? 'saving...' : 'save to wardrobe'}
        </button>
        {!canSave && !analysing && (
          <p className="text-xs text-gray-400 text-center mt-2">
            fill in name, category, type, color and at least one occasion
          </p>
        )}
      </div>
    </main>
  )
}
