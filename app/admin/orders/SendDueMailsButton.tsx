'use client'

import { useState } from 'react'

export default function SendDueMailsButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/trigger-due-mails', { method: 'POST' })
      const data = (await res.json()) as {
        sent?: number
        failed?: number
        skipped?: number
        error?: string
      }
      if (!res.ok) {
        alert(`Fehler: ${data.error ?? 'Unbekannt'}`)
      } else {
        alert(`Fertig — Versendet: ${data.sent}, Fehlgeschlagen: ${data.failed}, Übersprungen: ${data.skipped}`)
      }
    } catch (err) {
      alert(`Netzwerkfehler: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="ll-btn ll-btn--sm ll-btn--orange"
      style={{ whiteSpace: 'nowrap' }}
    >
      {loading ? 'Sende …' : 'Fällige Mails senden'}
    </button>
  )
}
