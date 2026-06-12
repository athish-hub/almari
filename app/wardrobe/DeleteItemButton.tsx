'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteItemButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading,    setLoading]    = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/items?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(107,40,40,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 10, zIndex: 10,
      }}>
        <p style={{ fontSize: 11, color: 'white', margin: 0, fontFamily: 'system-ui,sans-serif' }}>remove?</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={handleDelete} disabled={loading}
            style={{ fontSize: 11, padding: '5px 12px', minHeight: 32, borderRadius: 7, background: 'white', color: 'var(--color-primary)', border: 'none', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? '...' : 'yes'}
          </button>
          <button onClick={e => { e.stopPropagation(); setConfirming(false) }}
            style={{ fontSize: 11, padding: '5px 10px', minHeight: 32, borderRadius: 7, background: 'rgba(255,255,255,0.18)', color: 'white', border: 'none', cursor: 'pointer' }}>
            no
          </button>
        </div>
      </div>
    )
  }

  return (
    // 44px invisible touch target wrapping the 22px visual icon — meets --touch-min
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true) }}
      aria-label="delete item"
      style={{
        position: 'absolute', top: 0, right: 0,
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', cursor: 'pointer',
      }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </div>
    </button>
  )
}
