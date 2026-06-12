'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteLogButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading,    setLoading]    = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/log?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 500, fontFamily: 'system-ui,sans-serif' }}>remove?</span>
        <button onClick={handleDelete} disabled={loading}
          style={{ fontSize: 11, padding: '4px 10px', minHeight: 'var(--touch-min)', borderRadius: 7, background: 'var(--color-primary)', color: 'var(--color-ivory)', border: 'none', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '...' : 'yes'}
        </button>
        <button onClick={e => { e.stopPropagation(); setConfirming(false) }}
          style={{ fontSize: 11, padding: '4px 8px', minHeight: 'var(--touch-min)', borderRadius: 7, background: 'transparent', color: 'var(--color-text-muted)', border: '0.5px solid var(--color-ivory-border)', cursor: 'pointer' }}>
          no
        </button>
      </div>
    )
  }

  // 44px touch target wrapping small visual icon
  return (
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true) }}
      aria-label="delete log entry"
      style={{
        width: 'var(--touch-min)', height: 'var(--touch-min)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--color-text-faint)',
      }}
    >
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    </button>
  )
}
