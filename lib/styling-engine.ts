// ─────────────────────────────────────────────────────────────
// ALMARI — NIFT Styling Engine
// Outfit scoring + OOTD generation without AI
// Encodes what a NIFT master's graduate carries in their head
// ─────────────────────────────────────────────────────────────

import type {
  WardrobeItem,
  Outfit,
  OutfitItem,
  OutfitScore,
  StylistNote,
  GarmentCategory,
  FormalityLevel,
  PatternType,
  PatternScale,
  FabricWeight,
  TopSilhouette,
  BottomSilhouette,
  OccasionTag,
  ColorName,
} from './types'

import {
  COLOR_PROFILES,
  getOutfitColorScore,
  getTempCompatibility,
  getValueContrast,
  hasNeutralAnchor,
  suggestDominantColor,
} from './color-theory'

import { analyseGaps } from './gap-analysis'

// ─────────────────────────────────────────────────────────────
// VISUAL WEIGHT
// Every piece carries weight — dark, structured, heavy fabric,
// large pattern all add weight. Balance matters.
// ─────────────────────────────────────────────────────────────

export function getVisualWeight(item: WardrobeItem): number {
  let weight = 0

  // Color value contribution
  const colorValue = COLOR_PROFILES[item.primaryColor].value
  weight += colorValue === 'dark' ? 3 : colorValue === 'medium' ? 2 : 1

  // Pattern contribution
  const patternWeights: Record<PatternType, number> = {
    'solid': 0,
    'stripes-thin': 0,
    'stripes-bold': 1,
    'checks-small': 0,
    'checks-bold': 1,
    'floral-small': 1,
    'floral-large': 2,
    'geometric': 1,
    'abstract': 1,
    'animal-print': 2,
    'ethnic-print': 2,
    'embroidered': 3,
    'tie-dye': 1,
    'sequinned': 3,
  }
  weight += patternWeights[item.pattern] ?? 0

  // Fabric weight contribution
  const fabricWeights: Record<FabricWeight, number> = {
    'sheer': -1,
    'light': 0,
    'medium': 1,
    'heavy': 2,
    'structured': 3,
  }
  weight += fabricWeights[item.fabricWeight] ?? 0

  return weight
}

// ─────────────────────────────────────────────────────────────
// FORMALITY SCORING
// Max allowed spread is 2 levels between any two pieces.
// Mixing 1 (athleisure) with 5 (formal) = hard fail.
// ─────────────────────────────────────────────────────────────

function scoreFormalityMatch(items: WardrobeItem[]): {
  score: number
  note: string
  mismatch: boolean
} {
  const levels = items.map(i => i.formality)
  const min = Math.min(...levels) as FormalityLevel
  const max = Math.max(...levels) as FormalityLevel
  const spread = max - min

  if (spread === 0) return { score: 25, note: 'perfectly matched formality', mismatch: false }
  if (spread === 1) return { score: 22, note: 'one-step formality mix — works well', mismatch: false }
  if (spread === 2) return { score: 15, note: 'two-step mix — intentional dressing up/down', mismatch: false }
  if (spread === 3) return { score: 6,  note: 'formality mismatch — some pieces feel out of place', mismatch: true }
  return              { score: 0,  note: 'hard formality conflict — rethink the combination', mismatch: true }
}

// ─────────────────────────────────────────────────────────────
// PROPORTION & SILHOUETTE BALANCE
// The 1:1 rule — volume on top demands slim bottom, and vice versa.
// Breaking it deliberately (2 oversized pieces) is advanced styling;
// for the MVP we flag it.
// ─────────────────────────────────────────────────────────────

const TOP_VOLUME: Record<TopSilhouette, number> = {
  'fitted': 1,
  'semi-fitted': 2,
  'relaxed': 3,
  'oversized': 4,
  'cropped': 1,
  'structured': 3,
}

const BOTTOM_VOLUME: Record<BottomSilhouette, number> = {
  'skinny': 1,
  'slim': 2,
  'straight': 2,
  'wide-leg': 4,
  'flared': 3,
  'a-line': 3,
  'pleated': 3,
  'draped': 3,
}

function scoreProportionBalance(items: WardrobeItem[]): {
  score: number
  note: string
} {
  const top    = items.find(i => i.category === 'top')
  const bottom = items.find(i => i.category === 'bottom')

  if (!top || !bottom) {
    // No top+bottom pair to evaluate (could be a dress, saree etc.)
    return { score: 18, note: 'single silhouette — proportion managed by cut' }
  }

  const topVolume    = top.topSilhouette    ? TOP_VOLUME[top.topSilhouette]       : 2
  const bottomVolume = bottom.bottomSilhouette ? BOTTOM_VOLUME[bottom.bottomSilhouette] : 2
  const diff = Math.abs(topVolume - bottomVolume)

  if (diff <= 1) return { score: 20, note: 'balanced silhouette — well-proportioned' }
  if (diff === 2) return { score: 15, note: 'slight volume contrast — works with confidence' }
  if (diff === 3) {
    // Cropped top + wide leg is a specific intentional combo
    const isCroppedWide = top.topSilhouette === 'cropped' && bottom.bottomSilhouette === 'wide-leg'
    return isCroppedWide
      ? { score: 18, note: 'cropped top + wide leg — intentional and trendy' }
      : { score: 8, note: 'volume imbalance — both pieces compete' }
  }

  return { score: 4, note: 'strong volume conflict — one piece overwhelms the other' }
}

// ─────────────────────────────────────────────────────────────
// PATTERN MIXING RULES
// The cardinal rules from every styling textbook:
// — Max 2 patterns in one outfit
// — When mixing, vary the scale (large + small)
// — Stripes are semi-neutral and mix more freely
// — Solid always pairs with any pattern
// — Ethnic prints pair with solids; two ethnic prints rarely work
// ─────────────────────────────────────────────────────────────

const NEUTRAL_PATTERNS: PatternType[] = ['solid', 'stripes-thin']
const HEAVY_PATTERNS: PatternType[] = ['animal-print', 'embroidered', 'sequinned', 'ethnic-print', 'floral-large']

function scorePatternMix(items: WardrobeItem[]): {
  score: number
  note: string
} {
  const nonAccessoryItems = items.filter(i => i.category !== 'accessory' && i.category !== 'footwear')
  const patterns = nonAccessoryItems.map(i => i.pattern)
  const nonSolid = patterns.filter(p => p !== 'solid')
  const heavyPatterns = patterns.filter(p => HEAVY_PATTERNS.includes(p))

  if (nonSolid.length === 0) return { score: 15, note: 'all solids — pattern is not a concern' }
  if (nonSolid.length === 1) return { score: 15, note: 'one pattern against solids — textbook approach' }

  // Two patterns — check scale mix
  if (nonSolid.length === 2) {
    const bothHeavy = nonSolid.every(p => HEAVY_PATTERNS.includes(p))
    const scaleA = nonAccessoryItems.find(i => i.pattern === nonSolid[0])?.patternScale ?? 'medium'
    const scaleB = nonAccessoryItems.find(i => i.pattern === nonSolid[1])?.patternScale ?? 'medium'
    const scaleDiff = scaleA !== scaleB

    if (bothHeavy) return { score: 4, note: 'two heavy patterns — major visual overload' }
    if (scaleDiff)  return { score: 12, note: 'two patterns, different scale — works when colour is shared' }
    return                 { score: 7,  note: 'two same-scale patterns — reduce one to a solid or neutral pattern' }
  }

  // Three or more non-solid patterns = always problematic
  return { score: 0, note: '3+ patterns — choose one statement pattern, rest should be solid' }
}

// ─────────────────────────────────────────────────────────────
// VISUAL WEIGHT BALANCE
// Checks if the top and bottom halves balance each other.
// Heavy top → needs darker/heavier bottom OR an intentional contrast.
// ─────────────────────────────────────────────────────────────

function scoreVisualWeightBalance(items: WardrobeItem[]): {
  score: number
  note: string
} {
  const tops    = items.filter(i => ['top', 'outerwear'].includes(i.category))
  const bottoms = items.filter(i => i.category === 'bottom')

  if (tops.length === 0 || bottoms.length === 0) return { score: 8, note: 'no top-bottom pair to balance' }

  const topWeight    = tops.reduce((s, i) => s + getVisualWeight(i), 0) / tops.length
  const bottomWeight = bottoms.reduce((s, i) => s + getVisualWeight(i), 0) / bottoms.length
  const diff = Math.abs(topWeight - bottomWeight)

  if (diff <= 1) return { score: 10, note: 'well-balanced visual weight' }
  if (diff <= 2) return { score: 7,  note: 'slight weight imbalance — works for casual dressing' }
  if (diff <= 3) return { score: 4,  note: 'heavy imbalance — grounding piece needed' }
  return               { score: 1,  note: 'strong weight conflict — the heavier piece dominates entirely' }
}

// ─────────────────────────────────────────────────────────────
// COMPLETENESS CHECK (contributes to gap analysis too)
// ─────────────────────────────────────────────────────────────

function scoreCompleteness(items: WardrobeItem[]): {
  score: number
  note: string
} {
  const categories = items.map(i => i.category)
  const hasFootwear   = categories.includes('footwear')
  const hasAccessory  = categories.includes('accessory') || categories.includes('dupatta')
  const hasBottom     = categories.includes('bottom') || categories.includes('full-body')
  const hasTop        = categories.includes('top')    || categories.includes('full-body') || categories.includes('outerwear')

  let score = 0
  const notes: string[] = []

  if (hasTop && hasBottom) score += 4
  else if (categories.includes('full-body')) score += 4
  else notes.push('missing a top or bottom')

  if (hasFootwear) score += 4
  else notes.push('no footwear — outfit is incomplete')

  if (hasAccessory) score += 2
  else notes.push('no accessory — a small detail lifts the look')

  return {
    score,
    note: notes.length ? notes[0] : 'outfit is complete',
  }
}

// ─────────────────────────────────────────────────────────────
// MASTER SCORE — combines all dimensions
// ─────────────────────────────────────────────────────────────

export function scoreOutfit(items: WardrobeItem[]): OutfitScore {
  const colors = [
    ...items.map(i => i.primaryColor),
    ...items.filter(i => i.secondaryColor).map(i => i.secondaryColor as ColorName),
  ]

  const colorResult      = getOutfitColorScore(colors)
  const formalityResult  = scoreFormalityMatch(items)
  const proportionResult = scoreProportionBalance(items)
  const patternResult    = scorePatternMix(items)
  const weightResult     = scoreVisualWeightBalance(items)
  const completeness     = scoreCompleteness(items)

  // Scale sub-scores to their max weights:
  // Color harmony:      max 30
  // Formality match:    max 25
  // Proportion balance: max 20
  // Pattern mix:        max 15
  // Completeness:       max 10
  const colorScore      = Math.round((colorResult.score / 100) * 30)
  const formalityScore  = formalityResult.score
  const proportionScore = proportionResult.score
  const patternScore    = patternResult.score
  const weightBonus     = weightResult.score  // up to 10 — rolled into proportion
  const completenessScore = completeness.score

  const total = Math.min(100, colorScore + formalityScore + proportionScore + patternScore + weightBonus + completenessScore)

  return {
    total,
    breakdown: {
      colorHarmony: colorScore,
      formalityMatch: formalityScore,
      proportionBalance: proportionScore + weightBonus,
      patternMix: patternScore,
      completeness: completenessScore,
    },
  }
}

// ─────────────────────────────────────────────────────────────
// STYLIST NOTE GENERATION
// Plain language explanation of why this outfit works (or doesn't)
// ─────────────────────────────────────────────────────────────

export function generateStylistNote(items: WardrobeItem[], score: OutfitScore): StylistNote {
  const colors = items.map(i => i.primaryColor)
  const dominant = suggestDominantColor(colors)
  const colorScore = getOutfitColorScore(colors)
  const formalLevel = Math.round(items.reduce((s, i) => s + i.formality, 0) / items.length) as FormalityLevel

  const formalLabels: Record<FormalityLevel, string> = {
    1: 'athleisure', 2: 'casual', 3: 'smart casual', 4: 'semi-formal', 5: 'formal',
  }

  // Headline
  const headline = score.total >= 85
    ? `polished ${formalLabels[formalLevel]} look`
    : score.total >= 70
    ? `solid ${formalLabels[formalLevel]} look`
    : score.total >= 55
    ? `decent start — a few adjustments elevate this`
    : `foundation needs rethinking`

  // Color story
  const colorStory = colorScore.label

  // Proportion note
  const top = items.find(i => i.category === 'top')
  const bottom = items.find(i => i.category === 'bottom')
  const outerwear = items.find(i => i.category === 'outerwear')

  let proportionNote = 'the silhouette reads cleanly'
  if (top && bottom) {
    const topVol = top.topSilhouette ? TOP_VOLUME[top.topSilhouette] : 2
    const botVol = bottom.bottomSilhouette ? BOTTOM_VOLUME[bottom.bottomSilhouette] : 2
    if (topVol > botVol) proportionNote = `${top.topSilhouette ?? 'relaxed'} top over ${bottom.bottomSilhouette ?? 'slim'} bottom — volume sits on top`
    else if (botVol > topVol) proportionNote = `${bottom.bottomSilhouette ?? 'wide'} bottom anchors a lean top — clean proportion`
    else proportionNote = `balanced silhouette — equal volume top and bottom`
  }
  if (outerwear) proportionNote += `. ${outerwear.name} adds structure over the base`

  // Strengths
  const strengths: string[] = []
  if (score.breakdown.colorHarmony >= 22) strengths.push('color palette is well-composed')
  if (score.breakdown.formalityMatch >= 20) strengths.push('all pieces speak the same formality language')
  if (score.breakdown.patternMix >= 12) strengths.push('pattern discipline is on point')
  if (hasNeutralAnchor(colors)) strengths.push(`${dominant} grounds the look`)
  if (strengths.length === 0) strengths.push('foundation is in place')

  // Improvements
  const improvements: string[] = []
  if (score.breakdown.colorHarmony < 18) improvements.push('revisit the color pairing — one piece may be clashing')
  if (score.breakdown.formalityMatch < 15) improvements.push('formality levels are mismatched between pieces')
  if (score.breakdown.patternMix < 8) improvements.push('too many patterns — simplify to one statement piece')
  if (score.breakdown.completeness < 7) improvements.push('outfit feels unfinished — footwear or an accessory closes it')
  if (score.breakdown.proportionBalance < 10) improvements.push('proportion feels heavy on one end — balance the silhouette')

  return { headline, colorStory, proportionNote, strengths, improvements }
}

// ─────────────────────────────────────────────────────────────
// OCCASION COMPATIBILITY
// Does this outfit make sense for the target occasion?
// ─────────────────────────────────────────────────────────────

const OCCASION_FORMALITY_RANGE: Record<OccasionTag, [FormalityLevel, FormalityLevel]> = {
  'casual':            [1, 3],
  'college':           [1, 3],
  'sport':             [1, 2],
  'loungewear':        [1, 1],
  'travel':            [1, 3],
  'brunch':            [2, 4],
  'smart-casual':      [2, 4],
  'date-night':        [3, 5],
  'office':            [3, 4],
  'party-night':       [3, 5],
  'festive':           [3, 5],
  'wedding-guest':     [4, 5],
  'wedding-function':  [4, 5],
}

export function getOccasionFit(items: WardrobeItem[], occasion: OccasionTag): {
  fits: boolean
  score: number   // 0–100 additional modifier
  note: string
} {
  const avgFormality = Math.round(items.reduce((s, i) => s + i.formality, 0) / items.length) as FormalityLevel
  const [minF, maxF] = OCCASION_FORMALITY_RANGE[occasion]

  if (avgFormality >= minF && avgFormality <= maxF) {
    return { fits: true, score: 100, note: `formality is right for ${occasion}` }
  }
  if (avgFormality < minF) {
    return { fits: false, score: 40, note: `outfit is too casual for ${occasion} — dress it up` }
  }
  return { fits: false, score: 60, note: `outfit is overdressed for ${occasion} — dress it down` }
}

// ─────────────────────────────────────────────────────────────
// OOTD GENERATOR
// Given a wardrobe, return the best-scoring outfit for an occasion
// Uses a greedy anchor → complement → complete approach
// ─────────────────────────────────────────────────────────────

function categorise(items: WardrobeItem[]) {
  return {
    tops:       items.filter(i => i.category === 'top'),
    bottoms:    items.filter(i => i.category === 'bottom'),
    fullBody:   items.filter(i => i.category === 'full-body'),
    outerwear:  items.filter(i => i.category === 'outerwear'),
    dupattas:   items.filter(i => i.category === 'dupatta'),
    footwear:   items.filter(i => i.category === 'footwear'),
    accessories:items.filter(i => i.category === 'accessory'),
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Picks randomly from the top-3 scoring candidates so each run feels different
function pickBest<T extends WardrobeItem>(
  candidates: T[],
  score: (item: T) => number
): T | undefined {
  if (candidates.length === 0) return undefined
  const scored = candidates.map(item => ({ item, score: score(item) }))
  scored.sort((a, b) => b.score - a.score)
  const topN = scored.slice(0, Math.min(3, scored.length))
  return topN[Math.floor(Math.random() * topN.length)].item
}

function colorCompatScore(a: WardrobeItem, b: WardrobeItem): number {
  const { score } = getOutfitColorScore([a.primaryColor, b.primaryColor])
  return score
}

export function generateOOTD(
  wardrobe: WardrobeItem[],
  occasion: OccasionTag = 'smart-casual',
  excludeIds: string[] = [],
): Outfit {
  // Shuffle so every run explores a different combination
  const pool = shuffle(wardrobe.filter(i => i.isActive && !excludeIds.includes(i.id)))
  const { tops, bottoms, fullBody, outerwear, dupattas, footwear, accessories } = categorise(pool)
  const [minF, maxF] = OCCASION_FORMALITY_RANGE[occasion]

  // Filter each group by formality range (allow ±1 for flexibility)
  const formalTop      = tops.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)
  const formalBottom   = bottoms.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)
  const formalFullBody = fullBody.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)
  const formalOuter    = outerwear.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)

  const selectedItems: OutfitItem[] = []

  // ── Step 1: Pick base (full-body OR top+bottom) ──
  if (formalFullBody.length > 0 && (formalTop.length === 0 || Math.random() < 0.3)) {
    // Pick the most interesting full-body piece
    const base = pickBest(formalFullBody, i => i.formality) ?? formalFullBody[0]
    selectedItems.push({ item: base, role: 'anchor' })
  } else if (formalTop.length > 0 && formalBottom.length > 0) {
    // Pick anchor top first (statement piece — highest formality within range)
    const anchorTop = formalTop.reduce((best, item) => {
      const bestScore = COLOR_PROFILES[best.primaryColor].saturation === 'vibrant' ? 10 : 0
      const itemScore = COLOR_PROFILES[item.primaryColor].saturation === 'vibrant' ? 10 : 0
      return itemScore > bestScore ? item : best
    })
    selectedItems.push({ item: anchorTop, role: 'anchor' })

    // Pick best bottom that complements the anchor
    const bestBottom = pickBest(formalBottom, i => colorCompatScore(anchorTop, i)) ?? formalBottom[0]
    selectedItems.push({ item: bestBottom, role: 'base' })
  } else if (formalTop.length > 0) {
    selectedItems.push({ item: formalTop[0], role: 'anchor' })
  } else if (formalBottom.length > 0) {
    selectedItems.push({ item: formalBottom[0], role: 'base' })
  }

  if (selectedItems.length === 0) {
    // Fallback: take any 2 items
    pool.slice(0, 2).forEach(i => selectedItems.push({ item: i, role: 'base' }))
  }

  // ── Step 2: Add outerwear if occasion warrants it ──
  const outerwearOccasions: OccasionTag[] = ['office', 'smart-casual', 'date-night', 'party-night', 'wedding-guest', 'wedding-function']
  if (outerwearOccasions.includes(occasion) && formalOuter.length > 0) {
    const anchor = selectedItems[0].item
    const bestOuter = pickBest(formalOuter, i => colorCompatScore(anchor, i))
    if (bestOuter) selectedItems.push({ item: bestOuter, role: 'layer' })
  }

  // ── Step 3: Add dupatta if present and occasion is festive/wedding ──
  const dupattaOccasions: OccasionTag[] = ['festive', 'wedding-guest', 'wedding-function']
  if (dupattaOccasions.includes(occasion) && dupattas.length > 0) {
    const anchor = selectedItems[0].item
    const bestDupatta = pickBest(dupattas, i => colorCompatScore(anchor, i))
    if (bestDupatta) selectedItems.push({ item: bestDupatta, role: 'layer' })
  }

  // ── Step 4: Add footwear ──
  const formalFootwear = footwear.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)
  if (formalFootwear.length > 0) {
    const anchor = selectedItems[0].item
    const bestShoe = pickBest(formalFootwear, i => colorCompatScore(anchor, i))
    if (bestShoe) selectedItems.push({ item: bestShoe, role: 'footwear' })
  }

  // ── Step 5: Add one accessory ──
  const formalAcc = accessories.filter(i => i.formality >= minF - 1 && i.formality <= maxF + 1)
  if (formalAcc.length > 0) {
    const anchor = selectedItems[0].item
    const bestAcc = pickBest(formalAcc, i => colorCompatScore(anchor, i))
    if (bestAcc) selectedItems.push({ item: bestAcc, role: 'accessory' })
  }

  // ── Score and annotate ──
  const items = selectedItems.map(o => o.item)
  const score = scoreOutfit(items)
  const stylistNote = generateStylistNote(items, score)
  const gaps = analyseGaps(selectedItems, occasion)

  return {
    items: selectedItems,
    score,
    stylistNote,
    occasion,
    gaps,
    createdAt: new Date(),
  }
}

// ─────────────────────────────────────────────────────────────
// LOG TODAY'S LOOK
// User selects what they're wearing — score it, find gaps
// ─────────────────────────────────────────────────────────────

export function scoreTodaysLook(
  selectedItems: WardrobeItem[],
  occasion: OccasionTag = 'smart-casual',
): Outfit {
  const outfitItems: OutfitItem[] = selectedItems.map((item, idx) => ({
    item,
    role: idx === 0 ? 'anchor' : item.category === 'footwear' ? 'footwear'
      : item.category === 'accessory' ? 'accessory'
      : item.category === 'outerwear' ? 'layer' : 'base',
  }))

  const score = scoreOutfit(selectedItems)
  const stylistNote = generateStylistNote(selectedItems, score)
  const gaps = analyseGaps(outfitItems, occasion)

  return {
    items: outfitItems,
    score,
    stylistNote,
    occasion,
    gaps,
    createdAt: new Date(),
  }
}

// ─────────────────────────────────────────────────────────────
// WARDROBE STATS
// ─────────────────────────────────────────────────────────────

export function getWardrobeCompleteness(wardrobe: WardrobeItem[]): number {
  const categories: GarmentCategory[] = ['top', 'bottom', 'full-body', 'outerwear', 'footwear', 'accessory']
  const weights: Record<GarmentCategory, number> = {
    'top': 25,
    'bottom': 25,
    'full-body': 0,  // bonus if present
    'outerwear': 15,
    'footwear': 20,
    'accessory': 10,
    'dupatta': 5,
  }

  let score = 0
  for (const cat of categories) {
    const count = wardrobe.filter(i => i.category === cat && i.isActive).length
    if (count >= 3) score += weights[cat]
    else if (count >= 1) score += weights[cat] * 0.5
  }

  // Bonus: color diversity
  const uniqueColors = new Set(wardrobe.map(i => i.primaryColor)).size
  if (uniqueColors >= 6) score = Math.min(100, score + 5)

  return Math.min(100, Math.round(score))
}
