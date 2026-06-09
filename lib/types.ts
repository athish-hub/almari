// ─────────────────────────────────────────────────────────────
// ALMARI — Core Type System
// Vocabulary built for Indian wardrobes by someone who knows them
// ─────────────────────────────────────────────────────────────

// ── COLOR ─────────────────────────────────────────────────────

export type ColorName =
  // Neutrals — work with everything
  | 'white' | 'off-white' | 'ivory' | 'cream'
  | 'black' | 'charcoal' | 'graphite'
  | 'grey-light' | 'grey-medium' | 'grey-dark'
  | 'navy' | 'camel' | 'tan' | 'beige' | 'khaki'
  | 'brown' | 'chocolate'
  // Warm chromatrics
  | 'red' | 'crimson' | 'burgundy' | 'maroon'
  | 'coral' | 'terracotta' | 'rust'
  | 'orange' | 'amber'
  | 'yellow' | 'mustard' | 'gold'
  | 'olive' | 'lime'
  | 'pink' | 'blush' | 'rose' | 'hot-pink' | 'magenta' | 'fuchsia'
  // Cool chromatics
  | 'green' | 'emerald' | 'sage' | 'mint' | 'forest'
  | 'teal' | 'cyan'
  | 'blue-light' | 'blue-sky' | 'blue-royal' | 'blue-cobalt' | 'indigo'
  | 'purple' | 'violet' | 'lavender' | 'lilac' | 'plum'
  // Indian specific
  | 'saffron' | 'turmeric' | 'marigold'
  | 'peacock' | 'parrot-green'
  | 'rani-pink' | 'mehendi'
  // Special
  | 'multicolor' | 'printed' | 'other'

export type ColorTemp = 'warm' | 'cool' | 'neutral'
export type ColorValue = 'light' | 'medium' | 'dark' // affects visual weight

export interface ColorProfile {
  name: ColorName
  hex: string             // representative hex for display
  hue: number | null      // 0–360 on color wheel; null = achromatic neutral
  isNeutral: boolean
  temp: ColorTemp
  value: ColorValue
  saturation: 'muted' | 'mid' | 'vibrant'
}

// ── GARMENT CATEGORIES ────────────────────────────────────────

export type GarmentCategory =
  | 'top'          // shirts, tees, blouses, kurtis (worn on upper body, separate)
  | 'bottom'       // trousers, jeans, skirts, palazzos, salwars
  | 'full-body'    // dresses, jumpsuits, sarees, lehengas, anarkalis, co-ords
  | 'outerwear'    // blazers, jackets, cardigans, shawls, overcoats
  | 'dupatta'      // treated separately — layering + color accent
  | 'footwear'
  | 'accessory'    // belt, bag, watch, jewelry, scarf, hat, sunglasses

export type TopSubtype =
  | 't-shirt' | 'shirt' | 'blouse' | 'crop-top' | 'tank'
  | 'kurti' | 'kurta' | 'corset-top' | 'tube' | 'sweatshirt' | 'hoodie'

export type BottomSubtype =
  | 'jeans' | 'trousers' | 'chinos' | 'shorts' | 'skirt-mini'
  | 'skirt-midi' | 'skirt-maxi' | 'palazzo' | 'salwar' | 'dhoti-pants'
  | 'leggings' | 'track-pants' | 'culottes' | 'wide-leg'

export type FullBodySubtype =
  | 'dress-mini' | 'dress-midi' | 'dress-maxi'
  | 'jumpsuit' | 'romper'
  | 'saree' | 'lehenga' | 'anarkali' | 'sharara-set' | 'co-ord-set'

export type OuterwearSubtype =
  | 'blazer' | 'jacket-denim' | 'jacket-leather' | 'jacket-bomber'
  | 'cardigan' | 'shawl' | 'overcoat' | 'trench' | 'vest-structured'

export type FootwearSubtype =
  | 'sneakers' | 'loafers' | 'oxfords' | 'derby'
  | 'heels-stiletto' | 'heels-block' | 'heels-kitten' | 'mules' | 'wedges'
  | 'kolhapuris' | 'juttis' | 'mojaris' | 'flats' | 'sandals-flat' | 'sandals-heeled'
  | 'boots-ankle' | 'boots-knee' | 'chelsea-boots' | 'slides'

export type AccessorySubtype =
  | 'belt' | 'watch' | 'bag-tote' | 'bag-clutch' | 'bag-sling' | 'bag-structured'
  | 'necklace' | 'earrings' | 'bangles' | 'bracelet' | 'rings'
  | 'scarf' | 'sunglasses' | 'hat' | 'potli'

// ── FORMALITY ─────────────────────────────────────────────────

/**
 * 1 = Athleisure / loungewear
 * 2 = Casual (everyday errands, hanging out)
 * 3 = Smart Casual (brunch, casual office, college)
 * 4 = Business Casual / Semi-formal (office, parties, casual weddings)
 * 5 = Formal (corporate, weddings, events, black tie)
 */
export type FormalityLevel = 1 | 2 | 3 | 4 | 5

// ── PATTERN ───────────────────────────────────────────────────

export type PatternType =
  | 'solid'
  | 'stripes-thin'    // thin stripes read close to solid
  | 'stripes-bold'    // broad stripes have real visual weight
  | 'checks-small'    // tattersall, micro-check
  | 'checks-bold'     // windowpane, buffalo check
  | 'floral-small'
  | 'floral-large'
  | 'geometric'
  | 'abstract'
  | 'animal-print'
  | 'ethnic-print'    // block print, ajrakh, ikat, kalamkari
  | 'embroidered'     // counts as a texture+pattern combo
  | 'tie-dye'
  | 'sequinned'       // heavy embellishment

export type PatternScale = 'none' | 'small' | 'medium' | 'large'

// ── FABRIC / TEXTURE ──────────────────────────────────────────

export type FabricWeight = 'sheer' | 'light' | 'medium' | 'heavy' | 'structured'

export type FabricTexture =
  | 'smooth'       // silk, satin, polyester
  | 'matte'        // cotton, linen, crepe
  | 'knit'         // jersey, rib, sweater
  | 'denim'
  | 'textured'     // brocade, jacquard, velvet, corduroy
  | 'sheer'        // chiffon, georgette, organza

// ── SILHOUETTE ────────────────────────────────────────────────

export type TopSilhouette =
  | 'fitted'       // follows the body
  | 'semi-fitted'
  | 'relaxed'      // loose but not oversized
  | 'oversized'
  | 'cropped'      // above the natural waist
  | 'structured'   // blazer, jacket — holds its shape

export type BottomSilhouette =
  | 'skinny'
  | 'slim'
  | 'straight'
  | 'wide-leg'
  | 'flared'
  | 'a-line'
  | 'pleated'
  | 'draped'       // saree, dhoti

// ── OCCASION ──────────────────────────────────────────────────

export type OccasionTag =
  | 'casual'
  | 'office'
  | 'smart-casual'
  | 'date-night'
  | 'brunch'
  | 'festive'        // Diwali, Holi, Eid, Pongal, Navratri
  | 'wedding-guest'
  | 'wedding-function' // mehendi, sangeet, reception
  | 'party-night'
  | 'travel'
  | 'sport'
  | 'loungewear'
  | 'college'

// ── WARDROBE ITEM ─────────────────────────────────────────────

export interface WardrobeItem {
  id: string
  userId: string
  createdAt: Date

  // Identity
  name: string                       // user-given name e.g. "white linen shirt"
  category: GarmentCategory
  subtype: string                    // one of the subtype unions above

  // Color
  primaryColor: ColorName
  secondaryColor?: ColorName         // for two-tone or printed pieces

  // Style properties
  pattern: PatternType
  patternScale: PatternScale
  fabricWeight: FabricWeight
  fabricTexture: FabricTexture
  formality: FormalityLevel

  // Silhouette (only relevant for tops and bottoms)
  topSilhouette?: TopSilhouette
  bottomSilhouette?: BottomSilhouette

  // Occasions this item works for
  occasions: OccasionTag[]

  // Photo
  photoUrl?: string

  // Metadata
  brand?: string
  purchasePrice?: number
  isActive: boolean                  // false = retired from wardrobe
}

// ── OUTFIT ────────────────────────────────────────────────────

export interface OutfitItem {
  item: WardrobeItem
  role: 'anchor' | 'base' | 'complement' | 'layer' | 'footwear' | 'accessory'
}

export interface StylistNote {
  headline: string          // "solid smart casual look"
  colorStory: string        // "white + black neutral base with rose accent"
  proportionNote: string    // "structured blazer balances the slim trousers"
  strengths: string[]       // things working well
  improvements: string[]    // things to fix (leads into gaps)
}

export interface OutfitScore {
  total: number             // 0–100
  breakdown: {
    colorHarmony: number    // 0–30
    formalityMatch: number  // 0–25
    proportionBalance: number // 0–20
    patternMix: number      // 0–15
    completeness: number    // 0–10
  }
}

export interface Outfit {
  id?: string
  items: OutfitItem[]
  score: OutfitScore
  stylistNote: StylistNote
  occasion: OccasionTag
  gaps: Gap[]
  createdAt?: Date
}

// ── GAP ANALYSIS ──────────────────────────────────────────────

export type GapType =
  | 'missing-footwear'
  | 'missing-bottom'
  | 'missing-top'
  | 'missing-layer'
  | 'missing-accessory'
  | 'color-needs-anchor'     // all neutrals, needs a pop
  | 'color-needs-neutral'    // too many colors, needs grounding
  | 'formality-mismatch'
  | 'pattern-overload'

export type GapSeverity = 'critical' | 'moderate' | 'opportunity'

export interface Gap {
  type: GapType
  severity: GapSeverity
  message: string            // e.g. "outfit has no footwear"
  suggestion: string         // e.g. "a tan loafer or white sneaker finishes this"
  nudge: string              // short, warm, direct — the copy shown to user
  category: GarmentCategory  // what to look for
  colorSuggestions: ColorName[]
  priceRange: { min: number; max: number }  // INR
  scoreImpact: number        // how many points this gap costs
}

// ── DAILY LOG ─────────────────────────────────────────────────

export interface DailyLog {
  id: string
  userId: string
  date: Date
  outfit: Outfit
  photoUrl?: string          // the mirror selfie if uploaded
  mood?: 'loved-it' | 'okay' | 'would-change'
  occasion?: OccasionTag
}

// ── WARDROBE STATS ────────────────────────────────────────────

export interface WardrobeStats {
  totalItems: number
  completenessScore: number         // 0–100
  categoryCoverage: Record<GarmentCategory, number>
  colorDiversity: number            // 0–100
  occasionCoverage: OccasionTag[]   // occasions you can dress for
  mostWornColor: ColorName | null
  formalityRange: { min: FormalityLevel; max: FormalityLevel }
}
