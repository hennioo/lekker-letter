'use client'

import { useState } from 'react'

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
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
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Löschen fehlgeschlagen')
      window.location.href = '/admin/orders'
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px dashed rgba(120, 2, 40, 0.25)' }}>
      <button onClick={handleDelete} disabled={loading} className="ll-btn ll-btn--danger">
        {loading ? 'Wird gelöscht …' : 'Bestellung löschen'}
      </button>
      {error && (
        <p
          className="ll-error"
          style={{
            marginTop: '0.75rem',
          }}
        >
          Fehler: {error}
        </p>
      )}
    </div>
  )
}
