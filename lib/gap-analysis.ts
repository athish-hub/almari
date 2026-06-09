// ─────────────────────────────────────────────────────────────
// ALMARI — Gap Analysis Engine
// The commerce trigger: what's missing and what to buy
// ─────────────────────────────────────────────────────────────

import type {
  OutfitItem,
  Gap,
  GapType,
  GapSeverity,
  GarmentCategory,
  OccasionTag,
  ColorName,
  FormalityLevel,
} from './types'

import { COLOR_PROFILES, getPairHarmony } from './color-theory'

// ─────────────────────────────────────────────────────────────
// PRICE RANGES BY OCCASION/TIER (INR)
// Calibrated for aspirational tier-2 buyer
// ─────────────────────────────────────────────────────────────

const PRICE_RANGES: Record<GarmentCategory, { min: number; max: number }> = {
  'top':        { min: 799,  max: 3499 },
  'bottom':     { min: 999,  max: 4499 },
  'full-body':  { min: 1299, max: 6999 },
  'outerwear':  { min: 1999, max: 8999 },
  'dupatta':    { min: 399,  max: 1999 },
  'footwear':   { min: 1299, max: 6499 },
  'accessory':  { min: 299,  max: 2499 },
}

// ─────────────────────────────────────────────────────────────
// COLOR SUGGESTIONS FOR GAPS
// What color should the missing piece be?
// ─────────────────────────────────────────────────────────────

function suggestGapColors(
  existingColors: ColorName[],
  gapCategory: GarmentCategory,
): ColorName[] {
  // For footwear and accessories — neutrals almost always work
  if (gapCategory === 'footwear' || gapCategory === 'accessory') {
    const neutrals: ColorName[] = ['black', 'tan', 'camel', 'white', 'brown', 'navy']

    // If outfit is all dark, suggest lighter shoe
    const allDark = existingColors.every(c => COLOR_PROFILES[c].value === 'dark')
    if (allDark) return ['tan', 'camel', 'white', 'grey-light']

    // If outfit is all light, suggest darker anchor
    const allLight = existingColors.every(c => COLOR_PROFILES[c].value === 'light')
    if (allLight) return ['black', 'navy', 'brown', 'charcoal']

    return neutrals
  }

  // For missing tops or bottoms — find best harmonic complement
  const harmonicSuggestions: ColorName[] = []
  const allColors: ColorName[] = ['white', 'black', 'navy', 'camel', 'grey-medium', 'beige', 'tan', 'cream']

  // Add neutrals first
  harmonicSuggestions.push(...allColors)

  // Find colors that harmonise well with existing palette
  const chromatic: ColorName[] = [
    'olive', 'burgundy', 'teal', 'sage', 'rust', 'mustard',
    'blue-royal', 'emerald', 'rose', 'coral',
  ]
  for (const candidate of chromatic) {
    const avgHarmony = existingColors.reduce((sum, existing) => {
      return sum + getPairHarmony(existing, candidate).score
    }, 0) / existingColors.length

    if (avgHarmony >= 75) harmonicSuggestions.unshift(candidate)
  }

  return harmonicSuggestions.slice(0, 5)
}

// ─────────────────────────────────────────────────────────────
// FOOTWEAR GAP
// Most important gap — outfit feels unfinished without shoes
// ─────────────────────────────────────────────────────────────

function footwearGap(items: OutfitItem[], occasion: OccasionTag): Gap {
  const avgFormality = Math.round(
    items.reduce((s, i) => s + i.item.formality, 0) / items.length
  ) as FormalityLevel

  const colors = items.map(i => i.item.primaryColor)
  const suggestions = suggestGapColors(colors, 'footwear')

  const footwearNudge: Record<FormalityLevel, string> = {
    1: 'a clean white sneaker or slide wraps this up',
    2: 'white sneakers or slip-on loafers work perfectly here',
    3: 'loafers or block heels would finish this nicely',
    4: 'structured oxford or block heel — your outfit is asking for it',
    5: 'heels or formal oxford — this look deserves a sharp finish',
  }

  return {
    type: 'missing-footwear',
    severity: 'critical',
    message: 'no footwear in this outfit',
    suggestion: footwearNudge[avgFormality],
    nudge: `complete this look → ${footwearNudge[avgFormality]}`,
    category: 'footwear',
    colorSuggestions: suggestions,
    priceRange: PRICE_RANGES['footwear'],
    scoreImpact: 12,
  }
}

// ─────────────────────────────────────────────────────────────
// LAYERING GAP
// No outerwear when occasion warrants one
// ─────────────────────────────────────────────────────────────

function layerGap(items: OutfitItem[], occasion: OccasionTag): Gap {
  const colors = items.map(i => i.item.primaryColor)
  const suggestions = suggestGapColors(colors, 'outerwear')
  const avgFormality = Math.round(
    items.reduce((s, i) => s + i.item.formality, 0) / items.length
  ) as FormalityLevel

  const layerNudge: Record<FormalityLevel, string> = {
    1: 'a hoodie or oversized jacket adds structure',
    2: 'a denim jacket or cardigan layers this well',
    3: 'a cardigan or light blazer completes the smart casual balance',
    4: 'a fitted blazer turns this into a full look',
    5: 'a structured blazer or coat is missing here',
  }

  return {
    type: 'missing-layer',
    severity: 'moderate',
    message: 'outfit has no layering piece',
    suggestion: layerNudge[avgFormality],
    nudge: `add a layer → ${layerNudge[avgFormality]}`,
    category: 'outerwear',
    colorSuggestions: suggestions,
    priceRange: PRICE_RANGES['outerwear'],
    scoreImpact: 6,
  }
}

// ─────────────────────────────────────────────────────────────
// ACCESSORY GAP
// The finishing detail — elevates the score
// ─────────────────────────────────────────────────────────────

function accessoryGap(items: OutfitItem[], occasion: OccasionTag): Gap {
  const colors = items.map(i => i.item.primaryColor)
  const avgFormality = Math.round(
    items.reduce((s, i) => s + i.item.formality, 0) / items.length
  ) as FormalityLevel

  const accessoryNudge: Record<FormalityLevel, string> = {
    1: 'a cap or minimal chain adds personality',
    2: 'a simple watch or casual bag ties this together',
    3: 'a belt or sling bag would finish this cleanly',
    4: 'a watch or structured bag says you mean business',
    5: 'statement earrings or a clutch — the look demands it',
  }

  const colorSuggestions = suggestGapColors(colors, 'accessory')

  return {
    type: 'missing-accessory',
    severity: 'opportunity',
    message: 'no accessory — this is where the look gets its personality',
    suggestion: accessoryNudge[avgFormality],
    nudge: `finish the look → ${accessoryNudge[avgFormality]}`,
    category: 'accessory',
    colorSuggestions,
    priceRange: PRICE_RANGES['accessory'],
    scoreImpact: 5,
  }
}

// ─────────────────────────────────────────────────────────────
// COLOR ANCHOR GAP
// All neutrals — beautiful but needs a pop
// ─────────────────────────────────────────────────────────────

function colorAnchorGap(items: OutfitItem[]): Gap {
  const colors = items.map(i => i.item.primaryColor)
  const accentSuggestions: ColorName[] = ['terracotta', 'mustard', 'teal', 'burgundy', 'sage', 'rust', 'coral', 'olive']

  return {
    type: 'color-needs-anchor',
    severity: 'opportunity',
    message: 'all-neutral palette — clean but could use a color moment',
    suggestion: 'one colored piece (even a scarf or earrings) lifts an all-neutral look out of the ordinary',
    nudge: 'add a color accent → one pop is all it needs',
    category: 'accessory',
    colorSuggestions: accentSuggestions,
    priceRange: PRICE_RANGES['accessory'],
    scoreImpact: 5,
  }
}

// ─────────────────────────────────────────────────────────────
// COLOR OVERLOAD GAP
// Too many colors fighting each other
// ─────────────────────────────────────────────────────────────

function colorNeutralGap(items: OutfitItem[]): Gap {
  return {
    type: 'color-needs-neutral',
    severity: 'moderate',
    message: 'too many colors at once — the palette needs grounding',
    suggestion: 'swap one piece for a neutral (black, white, camel, navy) to let the others breathe',
    nudge: 'simplify the palette → one neutral grounds everything',
    category: 'top',
    colorSuggestions: ['white', 'black', 'navy', 'camel', 'grey-medium'],
    priceRange: PRICE_RANGES['top'],
    scoreImpact: 10,
  }
}

// ─────────────────────────────────────────────────────────────
// FORMALITY MISMATCH GAP
// ─────────────────────────────────────────────────────────────

function formalityGap(items: OutfitItem[]): Gap {
  const levels = items.map(i => i.item.formality)
  const min = Math.min(...levels)
  const max = Math.max(...levels)
  const spread = max - min

  const offender = items.find(i => Math.abs(i.item.formality - Math.round((min + max) / 2)) === spread / 2)

  return {
    type: 'formality-mismatch',
    severity: spread >= 3 ? 'critical' : 'moderate',
    message: `${spread}-level formality gap between pieces`,
    suggestion: offender
      ? `the ${offender.item.name} is pulling the outfit in a different direction — swap for something at formality level ${Math.round((min + max) / 2)}`
      : 'one piece is significantly more/less formal than the rest',
    nudge: 'fix the formality → one piece is out of register',
    category: offender?.item.category ?? 'top',
    colorSuggestions: ['white', 'black', 'navy', 'grey-medium'],
    priceRange: PRICE_RANGES[offender?.item.category ?? 'top'],
    scoreImpact: spread >= 3 ? 15 : 8,
  }
}

// ─────────────────────────────────────────────────────────────
// PATTERN OVERLOAD GAP
// ─────────────────────────────────────────────────────────────

function patternGap(items: OutfitItem[]): Gap {
  const patterned = items.filter(i =>
    i.item.category !== 'accessory' &&
    i.item.pattern !== 'solid' &&
    i.item.pattern !== 'stripes-thin'
  )

  return {
    type: 'pattern-overload',
    severity: patterned.length >= 3 ? 'critical' : 'moderate',
    message: `${patterned.length} patterned pieces competing for attention`,
    suggestion: `keep one pattern as the statement, rest should be solid — the ${patterned[0]?.item.name ?? 'boldest'} is your hero piece`,
    nudge: 'too many patterns → let one piece speak',
    category: patterned[1]?.item.category ?? 'top',
    colorSuggestions: ['white', 'black', 'navy', 'grey-medium', 'camel'],
    priceRange: PRICE_RANGES[patterned[1]?.item.category ?? 'top'],
    scoreImpact: patterned.length >= 3 ? 12 : 6,
  }
}

// ─────────────────────────────────────────────────────────────
// MASTER GAP ANALYSER
// Runs all checks and returns sorted gaps (critical first)
// ─────────────────────────────────────────────────────────────

export function analyseGaps(items: OutfitItem[], occasion: OccasionTag): Gap[] {
  const gaps: Gap[] = []
  const categories = items.map(i => i.item.category)
  const colors = items.map(i => i.item.primaryColor)
  const patterns = items
    .filter(i => i.item.category !== 'accessory')
    .map(i => i.item.pattern)

  // 1. Missing footwear — always critical
  if (!categories.includes('footwear')) {
    gaps.push(footwearGap(items, occasion))
  }

  // 2. Missing bottom (when no full-body piece)
  const hasBody = categories.includes('full-body')
  const hasBottom = categories.includes('bottom')
  const hasTop = categories.includes('top')

  if (!hasBody && !hasBottom && hasTop) {
    gaps.push({
      type: 'missing-bottom',
      severity: 'critical',
      message: 'no bottom in the outfit',
      suggestion: 'pair with trousers, jeans, or a skirt',
      nudge: 'outfit needs a bottom → what works with what you have',
      category: 'bottom',
      colorSuggestions: suggestGapColors(colors, 'bottom'),
      priceRange: PRICE_RANGES['bottom'],
      scoreImpact: 15,
    })
  }

  // 3. Formality mismatch
  const levels = items.map(i => i.item.formality)
  const formalSpread = Math.max(...levels) - Math.min(...levels)
  if (formalSpread >= 2) {
    gaps.push(formalityGap(items))
  }

  // 4. Pattern overload
  const nonSolidPatterns = patterns.filter(p => p !== 'solid' && p !== 'stripes-thin')
  if (nonSolidPatterns.length >= 2) {
    gaps.push(patternGap(items))
  }

  // 5. Color issues
  const chromaticColors = colors.filter(c => !COLOR_PROFILES[c].isNeutral && COLOR_PROFILES[c].hue !== null)
  if (chromaticColors.length === 0 && colors.length >= 2) {
    // All neutrals — opportunity to add color
    gaps.push(colorAnchorGap(items))
  } else if (chromaticColors.length >= 3) {
    // Color overload
    gaps.push(colorNeutralGap(items))
  }

  // 6. Missing layer for formal/office occasions
  const layerOccasions: OccasionTag[] = ['office', 'smart-casual', 'date-night', 'wedding-guest', 'wedding-function', 'party-night']
  if (layerOccasions.includes(occasion) && !categories.includes('outerwear')) {
    gaps.push(layerGap(items, occasion))
  }

  // 7. Missing accessory — always an opportunity
  if (!categories.includes('accessory') && !categories.includes('dupatta')) {
    gaps.push(accessoryGap(items, occasion))
  }

  // Sort: critical → moderate → opportunity
  const severityOrder: Record<GapSeverity, number> = { critical: 0, moderate: 1, opportunity: 2 }
  return gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}
