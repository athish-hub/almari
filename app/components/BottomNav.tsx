'use client'

import Link from 'next/link'

type Tab = 'home' | 'pieces' | 'today' | 'outfit'

const M = '#7B3030'
const G = '#C4B8B0'
const SF = "system-ui, -apple-system, sans-serif"

function NavItem({ href, active, label, children }: {
  href: string
  active: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active ? M : G }}>
      {children}
      <span style={{ fontFamily: SF, fontSize: 9, color: active ? M : G }}>{label}</span>
    </Link>
  )
}

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#F5F0E8',
      borderTop: '0.5px solid #D8D0C8',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      padding: '10px 0 20px',
      zIndex: 50,
    }}>

      <NavItem href="/" active={active === 'home'} label="home">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </NavItem>

      <NavItem href="/wardrobe" active={active === 'pieces'} label="pieces">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
        </svg>
      </NavItem>

      {/* FAB */}
      <Link href="/upload" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: G, marginTop: -18 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: M, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(123,48,48,0.35)' }}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <span style={{ fontFamily: SF, fontSize: 9, color: G, marginTop: 2 }}>add</span>
      </Link>

      <NavItem href="/log" active={active === 'today'} label="today">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </NavItem>

      <NavItem href="/ootd" active={active === 'outfit'} label="outfit">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </NavItem>

    </nav>
  )
}
