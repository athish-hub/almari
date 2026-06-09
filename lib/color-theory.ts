// ─────────────────────────────────────────────────────────────
// ALMARI — Color Theory Engine
// Built on classical color wheel theory + Indian wardrobe context
// ─────────────────────────────────────────────────────────────

import type { ColorName, ColorProfile, ColorTemp, ColorValue } from './types'

// ── COLOR REGISTRY ────────────────────────────────────────────
// hue = degrees on the 12-hue color wheel (0 = red, 120 = green, 240 = blue)
// null hue = achromatic (black, white, grey) — harmonises with everything

export const COLOR_PROFILES: Record<ColorName, ColorProfile> = {
  // ── Achromatic neutrals ──
  'white':          { name: 'white',       hex: '#FAFAFA', hue: null, isNeutral: true,  temp: 'neutral', value: 'light',  saturation: 'muted' },
  'off-white':      { name: 'off-white',   hex: '#F5F0E8', hue: null, isNeutral: true,  temp: 'warm',    value: 'light',  saturation: 'muted' },
  'ivory':          { name: 'ivory',       hex: '#FFFFF0', hue: null, isNeutral: true,  temp: 'warm',    value: 'light',  saturation: 'muted' },
  'cream':          { name: 'cream',       hex: '#FFF8DC', hue: null, isNeutral: true,  temp: 'warm',    value: 'light',  saturation: 'muted' },
  'black':          { name: 'black',       hex: '#1A1A1A', hue: null, isNeutral: true,  temp: 'neutral', value: 'dark',   saturation: 'muted' },
  'charcoal':       { name: 'charcoal',    hex: '#36454F', hue: null, isNeutral: true,  temp: 'cool',    value: 'dark',   saturation: 'muted' },
  'graphite':       { name: 'graphite',    hex: '#474747', hue: null, isNeutral: true,  temp: 'neutral', value: 'dark',   saturation: 'muted' },
  'grey-light':     { name: 'grey-light',  hex: '#D3D3D3', hue: null, isNeutral: true,  temp: 'neutral', value: 'light',  saturation: 'muted' },
  'grey-medium':    { name: 'grey-medium', hex: '#9E9E9E', hue: null, isNeutral: true,  temp: 'neutral', value: 'medium', saturation: 'muted' },
  'grey-dark':      { name: 'grey-dark',   hex: '#616161', hue: null, isNeutral: true,  temp: 'neutral', value: 'dark',   saturation: 'muted' },

  // ── Chromatic neutrals (low saturation, pair like neutrals) ──
  'navy':           { name: 'navy',        hex: '#1B2A4A', hue: 220, isNeutral: true,  temp: 'cool',    value: 'dark',   saturation: 'muted' },
  'camel':          { name: 'camel',       hex: '#C19A6B', hue: 33,  isNeutral: true,  temp: 'warm',    value: 'medium', saturation: 'muted' },
  'tan':            { name: 'tan',         hex: '#D2B48C', hue: 34,  isNeutral: true,  temp: 'warm',    value: 'medium', saturation: 'muted' },
  'beige':          { name: 'beige',       hex: '#F5F0DC', hue: 38,  isNeutral: true,  temp: 'warm',    value: 'light',  saturation: 'muted' },
  'khaki':          { name: 'khaki',       hex: '#C3B091', hue: 37,  isNeutral: true,  temp: 'warm',    value: 'medium', saturation: 'muted' },
  'brown':          { name: 'brown',       hex: '#8B5E3C', hue: 25,  isNeutral: true,  temp: 'warm',    value: 'dark',   saturation: 'muted' },
  'chocolate':      { name: 'chocolate',   hex: '#5C3317', hue: 20,  isNeutral: true,  temp: 'warm',    value: 'dark',   saturation: 'muted' },

  // ── Reds ──
  'red':            { name: 'red',         hex: '#C0392B', hue: 0,   isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'vibrant' },
  'crimson':        { name: 'crimson',     hex: '#DC143C', hue: 348, isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'vibrant' },
  'burgundy':       { name: 'burgundy',    hex: '#800020', hue: 345, isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'muted' },
  'maroon':         { name: 'maroon',      hex: '#800000', hue: 0,   isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'muted' },

  // ── Corals & oranges ──
  'coral':          { name: 'coral',       hex: '#FF6B6B', hue: 3,   isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'terracotta':     { name: 'terracotta',  hex: '#C26A4E', hue: 15,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'mid' },
  'rust':           { name: 'rust',        hex: '#B7410E', hue: 18,  isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'mid' },
  'orange':         { name: 'orange',      hex: '#E67E22', hue: 28,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'amber':          { name: 'amber',       hex: '#FFBF00', hue: 45,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },

  // ── Yellows ──
  'yellow':         { name: 'yellow',      hex: '#F4D03F', hue: 50,  isNeutral: false, temp: 'warm',    value: 'light',  saturation: 'vibrant' },
  'mustard':        { name: 'mustard',     hex: '#DFAF2C', hue: 44,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'mid' },
  'gold':           { name: 'gold',        hex: '#D4AF37', hue: 46,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'mid' },

  // ── Greens ──
  'olive':          { name: 'olive',       hex: '#808000', hue: 60,  isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'muted' },
  'lime':           { name: 'lime',        hex: '#AAFF00', hue: 75,  isNeutral: false, temp: 'cool',    value: 'light',  saturation: 'vibrant' },
  'green':          { name: 'green',       hex: '#27AE60', hue: 145, isNeutral: false, temp: 'cool',    value: 'medium', saturation: 'mid' },
  'emerald':        { name: 'emerald',     hex: '#046307', hue: 134, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'sage':           { name: 'sage',        hex: '#B2AC88', hue: 80,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'muted' },
  'mint':           { name: 'mint',        hex: '#AAF0D1', hue: 152, isNeutral: false, temp: 'cool',    value: 'light',  saturation: 'mid' },
  'forest':         { name: 'forest',      hex: '#228B22', hue: 120, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'mid' },

  // ── Teals & blues ──
  'teal':           { name: 'teal',        hex: '#008080', hue: 180, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'mid' },
  'cyan':           { name: 'cyan',        hex: '#00BCD4', hue: 187, isNeutral: false, temp: 'cool',    value: 'medium', saturation: 'vibrant' },
  'blue-light':     { name: 'blue-light',  hex: '#AED6F1', hue: 210, isNeutral: false, temp: 'cool',    value: 'light',  saturation: 'muted' },
  'blue-sky':       { name: 'blue-sky',    hex: '#87CEEB', hue: 197, isNeutral: false, temp: 'cool',    value: 'light',  saturation: 'mid' },
  'blue-royal':     { name: 'blue-royal',  hex: '#2255A4', hue: 220, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'blue-cobalt':    { name: 'blue-cobalt', hex: '#0047AB', hue: 215, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'indigo':         { name: 'indigo',      hex: '#3F51B5', hue: 231, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'mid' },

  // ── Pinks & purples ──
  'pink':           { name: 'pink',        hex: '#F48FB1', hue: 340, isNeutral: false, temp: 'warm',    value: 'light',  saturation: 'mid' },
  'blush':          { name: 'blush',       hex: '#F2C4CE', hue: 345, isNeutral: false, temp: 'warm',    value: 'light',  saturation: 'muted' },
  'rose':           { name: 'rose',        hex: '#E8A0BF', hue: 335, isNeutral: false, temp: 'warm',    value: 'light',  saturation: 'mid' },
  'hot-pink':       { name: 'hot-pink',    hex: '#FF69B4', hue: 330, isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'magenta':        { name: 'magenta',     hex: '#FF00FF', hue: 300, isNeutral: false, temp: 'cool',    value: 'medium', saturation: 'vibrant' },
  'fuchsia':        { name: 'fuchsia',     hex: '#C2185B', hue: 322, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'purple':         { name: 'purple',      hex: '#7B1FA2', hue: 291, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'violet':         { name: 'violet',      hex: '#9C27B0', hue: 291, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'mid' },
  'lavender':       { name: 'lavender',    hex: '#E6E6FA', hue: 240, isNeutral: false, temp: 'cool',    value: 'light',  saturation: 'muted' },
  'lilac':          { name: 'lilac',       hex: '#C8A2C8', hue: 300, isNeutral: false, temp: 'cool',    value: 'medium', saturation: 'muted' },
  'plum':           { name: 'plum',        hex: '#4A0E4E', hue: 298, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'mid' },

  // ── Indian specific ──
  'saffron':        { name: 'saffron',     hex: '#FF9933', hue: 36,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'turmeric':       { name: 'turmeric',    hex: '#D4A017', hue: 44,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'mid' },
  'marigold':       { name: 'marigold',    hex: '#FFA500', hue: 39,  isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'peacock':        { name: 'peacock',     hex: '#006994', hue: 200, isNeutral: false, temp: 'cool',    value: 'dark',   saturation: 'vibrant' },
  'parrot-green':   { name: 'parrot-green',hex: '#4DB33D', hue: 115, isNeutral: false, temp: 'cool',    value: 'medium', saturation: 'vibrant' },
  'rani-pink':      { name: 'rani-pink',   hex: '#E75480', hue: 336, isNeutral: false, temp: 'warm',    value: 'medium', saturation: 'vibrant' },
  'mehendi':        { name: 'mehendi',     hex: '#5C4827', hue: 30,  isNeutral: false, temp: 'warm',    value: 'dark',   saturation: 'muted' },

  // ── Special ──
  'multicolor':     { name: 'multicolor',  hex: '#E0E0E0', hue: null, isNeutral: false, temp: 'neutral', value: 'medium', saturation: 'vibrant' },
  'printed':        { name: 'printed',     hex: '#E0E0E0', hue: null, isNeutral: false, temp: 'neutral', value: 'medium', saturation: 'mid' },
  'other':          { name: 'other',       hex: '#E0E0E0', hue: null, isNeutral: false, temp: 'neutral', value: 'medium', saturation: 'mid' },
}

// ── HARMONY TYPES ─────────────────────────────────────────────

export type HarmonyType =
  | 'neutral-neutral'        // both neutrals — always works
  | 'neutral-chromatic'      // neutral + any color — always works
  | 'monochromatic'          // same hue family
  | 'analogous'              // adjacent on wheel (≤60°)
  | 'complementary'          // opposite on wheel (150–210°)
  | 'split-complementary'    // one side of complement (120–150°)
  | 'triadic'                // 120° apart
  | 'clash'                  // near-complementary, neither analogous nor complement (60–120°)
  | 'neutral-safe'           // one is neutral-ish (navy, camel, olive etc)

export interface HarmonyResult {
  type: HarmonyType
  score: number              // 0–100 (contribution to color harmony component)
  label: string              // human-readable summary
  tip?: string               // styling tip when relevant
}

// ── HUE DISTANCE ─────────────────────────────────────────────

function hueDelta(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

// ── PAIR HARMONY ──────────────────────────────────────────────

export function getPairHarmony(colorA: ColorName, colorB: ColorName): HarmonyResult {
  const a = COLOR_PROFILES[colorA]
  const b = COLOR_PROFILES[colorB]

  // Both neutrals — always safe
  if (a.isNeutral && b.isNeutral) {
    const contrast = a.value !== b.value
    return {
      type: 'neutral-neutral',
      score: contrast ? 95 : 75,
      label: contrast ? 'tonal neutral contrast — classic' : 'tonal neutral blend — subtle',
      tip: contrast ? undefined : 'add a colored accessory to lift the look',
    }
  }

  // One is neutral
  if (a.isNeutral || b.isNeutral) {
    return {
      type: 'neutral-chromatic',
      score: 88,
      label: `neutral grounds the ${a.isNeutral ? b.name : a.name}`,
    }
  }

  // Both chromatic — use hue wheel
  if (a.hue === null || b.hue === null) {
    // multicolor / printed — treat as neutral-ish
    return { type: 'neutral-safe', score: 70, label: 'printed piece — treat as a neutral base' }
  }

  const delta = hueDelta(a.hue, b.hue)

  // Same hue family (within 30°) — monochromatic
  if (delta <= 30) {
    return {
      type: 'monochromatic',
      score: 85,
      label: 'monochromatic — elegant and elongating',
      tip: 'vary fabric texture or silhouette to add interest',
    }
  }

  // Analogous (30–60°)
  if (delta <= 60) {
    return {
      type: 'analogous',
      score: 80,
      label: 'analogous harmony — cohesive and easy to wear',
    }
  }

  // Clash zone — neither analogous nor complement (60°–120° and 240°–300°)
  if (delta > 60 && delta < 120) {
    // Exception: if one is very muted/dark (like olive, navy, burgundy), clash is reduced
    const oneMuted = a.saturation === 'muted' || b.saturation === 'muted'
    return {
      type: 'clash',
      score: oneMuted ? 55 : 35,
      label: oneMuted
        ? 'near-clash — muted tones reduce the tension'
        : 'color clash — these hues compete visually',
      tip: oneMuted
        ? 'anchor with a neutral third piece to mediate'
        : 'swap one piece for a neutral or a closer hue on the wheel',
    }
  }

  // Split-complementary zone (120–150°)
  if (delta >= 120 && delta < 150) {
    return {
      type: 'split-complementary',
      score: 72,
      label: 'split-complementary — dynamic but needs a neutral anchor',
      tip: 'introduce a neutral (black, white, camel) as the third piece',
    }
  }

  // Triadic (close to 120° — covered above, but 115–125° sweep)
  if (delta >= 115 && delta <= 125) {
    return {
      type: 'triadic',
      score: 68,
      label: 'triadic — bold and expressive, harder to balance',
      tip: 'let one color dominate at 60%, keep others as accents',
    }
  }

  // Complementary (150–210°)
  if (delta >= 150) {
    // True complementary (180° ±15°) is highest impact
    const trueComplement = delta >= 165 && delta <= 195
    return {
      type: 'complementary',
      score: trueComplement ? 78 : 72,
      label: trueComplement
        ? 'complementary — high contrast, maximum visual impact'
        : 'near-complementary — strong contrast, confident look',
      tip: 'use 70/30 ratio — let one color lead, the other accent',
    }
  }

  return { type: 'neutral-safe', score: 60, label: 'acceptable combination' }
}

// ── MULTI-COLOR HARMONY ───────────────────────────────────────
// Score an entire outfit's color palette (up to 4 colors)

export function getOutfitColorScore(colors: ColorName[]): {
  score: number
  label: string
  notes: string[]
} {
  const unique = [...new Set(colors)]
  const notes: string[] = []

  // Filter out neutrals for chromatic count
  const chromaticColors = unique.filter(c => !COLOR_PROFILES[c].isNeutral && COLOR_PROFILES[c].hue !== null)
  const neutralCount = unique.length - chromaticColors.length

  // Rule: 60-30-10 — ideally 1 dominant + 1 secondary + neutral
  if (chromaticColors.length === 0) {
    return { score: 85, label: 'all-neutral palette — clean and versatile', notes: ['add a color accent to lift above 90'] }
  }

  if (chromaticColors.length > 3) {
    notes.push('too many colors at once — pick a dominant and reduce to 2 chromatic pieces')
    return { score: 30, label: 'color overload', notes }
  }

  if (chromaticColors.length === 1) {
    const score = neutralCount >= 1 ? 90 : 80
    notes.push(neutralCount >= 1 ? 'one color + neutral — textbook styling' : 'one chromatic, needs a neutral ground')
    return { score, label: 'focused palette', notes }
  }

  // 2 chromatic colors — score the pair
  if (chromaticColors.length === 2) {
    const harmony = getPairHarmony(chromaticColors[0], chromaticColors[1])
    if (harmony.score < 50) notes.push(harmony.tip ?? 'consider changing one piece to a neutral')
    const baseScore = harmony.score
    // Bonus if neutral present to anchor
    const finalScore = Math.min(100, baseScore + (neutralCount > 0 ? 8 : 0))
    return { score: finalScore, label: harmony.label, notes: harmony.tip ? [harmony.tip] : [] }
  }

  // 3 chromatic — check all pairs
  const pairs = [
    getPairHarmony(chromaticColors[0], chromaticColors[1]),
    getPairHarmony(chromaticColors[1], chromaticColors[2]),
    getPairHarmony(chromaticColors[0], chromaticColors[2]),
  ]
  const avgPairScore = pairs.reduce((s, p) => s + p.score, 0) / 3
  const worstPair = pairs.reduce((min, p) => p.score < min.score ? p : min, pairs[0])
  if (worstPair.score < 50 && worstPair.tip) notes.push(worstPair.tip)
  notes.push('three colors in one outfit — one must clearly dominate')

  return {
    score: Math.max(20, avgPairScore - 10),  // 3-color penalty
    label: avgPairScore > 70 ? 'bold palette — works with confidence' : 'complex palette — needs editing',
    notes,
  }
}

// ── TEMP COMPATIBILITY ────────────────────────────────────────
// Warm + cool mixing — can work but needs intention

export function getTempCompatibility(temps: ColorTemp[]): {
  score: number
  note: string
} {
  const warm = temps.filter(t => t === 'warm').length
  const cool = temps.filter(t => t === 'cool').length

  if (warm === 0 || cool === 0) {
    return { score: 100, note: 'consistent temperature — cohesive feel' }
  }

  if (Math.abs(warm - cool) >= 2) {
    return { score: 80, note: 'mostly one temperature — small contrast adds interest' }
  }

  return {
    score: 60,
    note: 'equal warm and cool — intentional mixing needed, otherwise looks accidental',
  }
}

// ── VALUE CONTRAST ────────────────────────────────────────────
// Light vs dark distribution — affects visual legibility and impact

export function getValueContrast(values: ColorValue[]): {
  score: number
  note: string
} {
  const lights = values.filter(v => v === 'light').length
  const darks  = values.filter(v => v === 'dark').length
  const mids   = values.filter(v => v === 'medium').length

  const hasContrast = lights > 0 && darks > 0
  const allSame = lights === values.length || darks === values.length || mids === values.length

  if (hasContrast) return { score: 90, note: 'light-dark contrast — visually strong' }
  if (allSame && mids === values.length) return { score: 70, note: 'all mid-tones — soft and subtle' }
  if (allSame) return { score: 75, note: 'uniform value — elegant when intentional' }

  return { score: 80, note: 'gentle value variation — wearable' }
}

// ── NEUTRAL ANCHOR CHECK ───────────────────────────────────────
// Does the outfit have something to ground it?

export function hasNeutralAnchor(colors: ColorName[]): boolean {
  return colors.some(c => COLOR_PROFILES[c].isNeutral)
}

// ── DOMINANT COLOR RULE ──────────────────────────────────────
// Returns which color should be the dominant (most surface area)
// In a well-styled outfit: 60% dominant + 30% secondary + 10% accent

export function suggestDominantColor(colors: ColorName[]): ColorName {
  const profiles = colors.map(c => COLOR_PROFILES[c])
  // Prefer neutrals as dominant — they're the safe 60%
  const neutrals = colors.filter(c => COLOR_PROFILES[c].isNeutral)
  if (neutrals.length > 0) return neutrals[0]
  // Otherwise pick the most muted
  const byMuted = profiles.sort((a, b) => {
    const order = { muted: 0, mid: 1, vibrant: 2 }
    return order[a.saturation] - order[b.saturation]
  })
  return byMuted[0].name
}
