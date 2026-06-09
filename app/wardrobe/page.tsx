export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'

const DEMO_USER = 'demo'

const COLOR_HEX: Record<string, string> = {
  white: '#FAFAFA', 'off-white': '#F5F0E8', ivory: '#FFFFF0', cream: '#FFF8DC',
  black: '#1A1A1A', charcoal: '#36454F', graphite: '#474747',
  'grey-light': '#D3D3D3', 'grey-medium': '#9E9E9E', 'grey-dark': '#616161',
  navy: '#1B2A4A', camel: '#C19A6B', tan: '#D2B48C', beige: '#F5F0DC',
  khaki: '#C3B091', brown: '#8B5E3C', chocolate: '#5C3317',
  red: '#C0392B', crimson: '#DC143C', burgundy: '#800020', maroon: '#800000',
  coral: '#FF6B6B', terracotta: '#C26A4E', rust: '#B7410E',
  orange: '#E67E22', amber: '#FFBF00',
  yellow: '#F4D03F', mustard: '#DFAF2C', gold: '#D4AF37',
  olive: '#808000', lime: '#AAFF00',
  green: '#27AE60', emerald: '#046307', sage: '#B2AC88', mint: '#AAF0D1', forest: '#228B22',
  teal: '#008080', cyan: '#00BCD4',
  'blue-light': '#AED6F1', 'blue-sky': '#87CEEB', 'blue-royal': '#2255A4',
  'blue-cobalt': '#0047AB', indigo: '#3F51B5',
  pink: '#F48FB1', blush: '#F2C4CE', rose: '#E8A0BF', 'hot-pink': '#FF69B4',
  magenta: '#FF00FF', fuchsia: '#C2185B',
  purple: '#7B1FA2', violet: '#9C27B0', lavender: '#E6E6FA', lilac: '#C8A2C8', plum: '#4A0E4E',
  saffron: '#FF9933', turmeric: '#D4A017', marigold: '#FFA500',
  peacock: '#006994', 'parrot-green': '#4DB33D', 'rani-pink': '#E75480', mehendi: '#5C4827',
}

const CATEGORY_ORDER = ['top', 'bottom', 'full-body', 'outerwear', 'footwear', 'accessory', 'dupatta']

export default async function WardrobePage() {
  const items = await prisma.wardrobeItem.findMany({
    where: { userId: DEMO_USER, isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  const byCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 pt-8 pb-28">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">my wardrobe</h1>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: '#534AB7' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          add
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#534AB7" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-500">your wardrobe is empty</p>
          <Link
            href="/upload"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: '#534AB7' }}
          >
            add your first piece
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCategory).map(([category, catItems]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">{category}</h2>
                <span className="text-xs text-gray-300">{catItems.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {catItems.map(item => (
                  <div key={item.id} className="group relative rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                    <div className="aspect-[2/3] flex items-center justify-center">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full"
                          style={{ background: COLOR_HEX[item.primaryColor] ?? '#E5E7EB' }}
                        />
                      )}
                    </div>
                    <div className="px-2 py-2 bg-white border-t border-gray-100">
                      <p className="text-xs text-gray-700 font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {item.primaryColor} · f{item.formality}
                      </p>
                    </div>
                    {/* Formality badge */}
                    <div
                      className="absolute top-2 left-2 text-white text-xs px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: '#534AB7', fontSize: 9 }}
                    >
                      {['', 'sport', 'casual', 'smart', 'semi', 'formal'][item.formality]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
        <Link href="/wardrobe" className="flex flex-col items-center gap-1" style={{ color: '#534AB7' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span className="text-xs font-medium">wardrobe</span>
        </Link>
        <Link href="/upload" className="flex flex-col items-center gap-1 text-gray-300">
          <div className="w-10 h-10 rounded-full flex items-center justify-center -mt-5" style={{ background: '#534AB7' }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <span className="text-xs">add</span>
        </Link>
        <Link href="/log" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span className="text-xs">log look</span>
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
