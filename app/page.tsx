export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'

const DEMO_USER = 'demo'

export default async function HomePage() {
  const items = await prisma.wardrobeItem.findMany({
    where: { userId: DEMO_USER, isActive: true },
  })

  const categoryCount = {
    top: items.filter(i => i.category === 'top').length,
    bottom: items.filter(i => i.category === 'bottom').length,
    footwear: items.filter(i => i.category === 'footwear').length,
    outerwear: items.filter(i => i.category === 'outerwear').length,
    accessory: items.filter(i => i.category === 'accessory').length,
  }

  // Simple completeness: weighted by category presence
  const completeness = Math.min(100, Math.round(
    (Math.min(categoryCount.top, 3) / 3) * 25 +
    (Math.min(categoryCount.bottom, 3) / 3) * 25 +
    (Math.min(categoryCount.footwear, 2) / 2) * 20 +
    (Math.min(categoryCount.outerwear, 1) / 1) * 15 +
    (Math.min(categoryCount.accessory, 2) / 2) * 15
  ))

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'good morning' : hour < 17 ? 'good afternoon' : 'good evening'
  const day = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto px-4 pt-12 pb-24">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">{day}</p>
        <h1 className="text-2xl font-medium text-gray-900">{greeting}</h1>
      </div>

      {/* Primary CTA — Log today */}
      <Link href="/log" className="block mb-3">
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#534AB7' }}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-violet-900 text-sm">how are you dressed today?</p>
            <p className="text-violet-600 text-xs mt-0.5">log your look, get scored</p>
          </div>
          <svg width="16" height="16" fill="none" stroke="#7C70D8" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </Link>

      {/* Secondary CTA — Build OOTD */}
      <Link href="/ootd" className="block mb-8">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" fill="none" stroke="#374151" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">build an outfit</p>
            <p className="text-gray-400 text-xs mt-0.5">pick pieces, almari styles them</p>
          </div>
          <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </Link>

      {/* Wardrobe completeness */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">wardrobe completeness</p>
          <p className="text-xs font-medium" style={{ color: '#534AB7' }}>{completeness}%</p>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completeness}%`, background: '#534AB7' }}
          />
        </div>
        {items.length === 0 && (
          <p className="text-xs text-gray-400 mt-2">add your first piece to get started</p>
        )}
      </div>

      {/* Wardrobe quick stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[
            { label: 'items', value: items.length },
            { label: 'categories', value: Object.values(categoryCount).filter(v => v > 0).length },
            { label: 'outfits', value: Math.floor(Math.min(categoryCount.top, categoryCount.bottom) * 1.5) },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-medium text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Wardrobe preview */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-700">your wardrobe</p>
        <Link href="/wardrobe" className="text-xs" style={{ color: '#534AB7' }}>see all</Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-10 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">your wardrobe is empty</p>
          <Link
            href="/upload"
            className="text-sm font-medium px-4 py-2 rounded-xl text-white mt-2"
            style={{ background: '#534AB7' }}
          >
            add first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.slice(0, 5).map(item => (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 aspect-[2/3] flex flex-col overflow-hidden">
              <div className="flex-1 flex items-center justify-center">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full" style={{ background: getColorHex(item.primaryColor) }} />
                )}
              </div>
              <div className="px-2 py-1.5 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-500 truncate">{item.name}</p>
              </div>
            </div>
          ))}
          <Link href="/upload" className="rounded-xl border border-dashed border-gray-200 aspect-[2/3] flex flex-col items-center justify-center gap-1 text-gray-300">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span className="text-xs">add</span>
          </Link>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#534AB7" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-xs" style={{ color: '#534AB7' }}>home</span>
        </Link>
        <Link href="/wardrobe" className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span className="text-xs">wardrobe</span>
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

function getColorHex(colorName: string): string {
  const map: Record<string, string> = {
    white: '#FAFAFA', black: '#1A1A1A', navy: '#1B2A4A', camel: '#C19A6B',
    red: '#C0392B', blue: '#2255A4', green: '#27AE60', yellow: '#F4D03F',
    pink: '#F48FB1', purple: '#7B1FA2', orange: '#E67E22', teal: '#008080',
    grey: '#9E9E9E', beige: '#F5F0DC', brown: '#8B5E3C', olive: '#808000',
    coral: '#FF6B6B', rose: '#E8A0BF', mustard: '#DFAF2C', burgundy: '#800020',
  }
  return map[colorName] ?? '#E5E7EB'
}
