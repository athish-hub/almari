'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteLogButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/log?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#8B3535', fontWeight: 500 }}>remove?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 7, background: '#8B3535', color: 'white', border: 'none', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '...' : 'yes'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); setConfirming(false) }}
          style={{ fontSize: 11, padding: '4px 8px', borderRadius: 7, background: 'transparent', color: '#8A7E7E', border: '0.5px solid #DDD5CC', cursor: 'pointer' }}
        >
          no
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true) }}
      aria-label="delete log entry"
      style={{
        background: 'transparent', border: 'none',
        cursor: 'pointer', padding: 4,
        display: 'flex', alignItems: 'center',
        color: '#C4B0B0',
      }}
    >
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    </button>
  )
}
