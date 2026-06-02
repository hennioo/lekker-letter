'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      'Wirklich löschen? Das kann nicht rückgängig gemacht werden.'
    )
    if (!confirmed) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/delete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Löschen fehlgeschlagen')
      router.push('/admin/orders')
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: loading ? '#ccc' : '#c0392b',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem',
        }}
      >
        {loading ? 'Wird gelöscht…' : 'Bestellung löschen'}
      </button>
      {error && (
        <p style={{ color: '#c0392b', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          Fehler: {error}
        </p>
      )}
    </div>
  )
}
