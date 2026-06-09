'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteItemButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/items?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(139,53,53,0.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8, borderRadius: 10, zIndex: 10,
      }}>
        <p style={{ fontSize: 11, color: 'white', margin: 0, fontWeight: 500 }}>remove?</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{ fontSize: 11, padding: '5px 12px', borderRadius: 7, background: 'white', color: '#8B3535', border: 'none', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '...' : 'yes, remove'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); setConfirming(false) }}
            style={{ fontSize: 11, padding: '5px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.18)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true) }}
      aria-label="delete item"
      style={{
        position: 'absolute', top: 5, right: 5,
        width: 24, height: 24, borderRadius: 7,
        background: 'rgba(0,0,0,0.32)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    </button>
  )
}
