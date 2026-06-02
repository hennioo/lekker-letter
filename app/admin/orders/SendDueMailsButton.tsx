'use client'

import { useState } from 'react'

export default function SendDueMailsButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/trigger-due-mails', {
        method: 'POST',
      })
      const data = await res.json() as { sent?: number; failed?: number; skipped?: number; error?: string }
      if (!res.ok) {
        alert(`Error: ${data.error ?? 'Unknown error'}`)
      } else {
        alert(`Done — Sent: ${data.sent}, Failed: ${data.failed}, Skipped: ${data.skipped}`)
      }
    } catch (err) {
      alert(`Network error: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: loading ? '#ccc' : '#2d6a4f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? 'Sending…' : 'Send Due Mails Now'}
    </button>
  )
}
