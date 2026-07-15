'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function PreviewActions({
  scheduledMailId,
  initialStatus,
  hasGeneratedText,
}: {
  scheduledMailId: string
  initialStatus: string
  hasGeneratedText: boolean
}) {
  const [approveState, setApproveState] = useState<State>('idle')
  const [approveError, setApproveError] = useState<string | null>(null)
  const [sendState, setSendState] = useState<State>('idle')
  const [currentStatus, setCurrentStatus] = useState(initialStatus)

  async function handleApprove() {
    setApproveState('loading')
    setApproveError(null)
    try {
      const res = await fetch('/api/approve-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledMailId }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Approve fehlgeschlagen')
      }
      setApproveState('done')
      setCurrentStatus('approved')
    } catch (err) {
      setApproveError((err as Error).message)
      setApproveState('error')
    }
  }

  async function handleSendTest() {
    setSendState('loading')
    try {
      const res = await fetch('/api/send-test-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledMailId }),
      })
      const responseBody = await res.json().catch(() => null)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(responseBody)}`)
      setSendState('done')
    } catch (err) {
      console.error('[PreviewActions] handleSendTest error:', err)
      setSendState('error')
    }
  }

  const statusClassName = (() => {
    const key = currentStatus.toLowerCase()
    if (['draft', 'pending', 'approved', 'sent', 'failed', 'cancelled'].includes(key)) {
      return `ll-status ll-status--${key}`
    }
    return 'll-status ll-status--draft'
  })()

  const alreadyFinal =
    currentStatus === 'sent' || currentStatus === 'approved' || currentStatus === 'cancelled'
  const approveDisabled =
    !hasGeneratedText || alreadyFinal || approveState === 'loading' || approveState === 'done'
  const approveTitle = !hasGeneratedText
    ? 'Zuerst Text generieren'
    : alreadyFinal
    ? `Mail ist bereits ${currentStatus}`
    : undefined
  const approveLabel =
    approveState === 'loading'
      ? 'Approving …'
      : approveState === 'done'
      ? 'Approved ✓'
      : currentStatus === 'sent'
      ? 'Bereits versendet'
      : currentStatus === 'approved'
      ? 'Bereits approved'
      : currentStatus === 'cancelled'
      ? 'Abgebrochen'
      : approveState === 'error'
      ? 'Fehler — Retry'
      : 'Approve'

  const sendLabel =
    sendState === 'loading'
      ? 'Sende …'
      : sendState === 'done'
      ? 'Gesendet ✓'
      : sendState === 'error'
      ? 'Fehler — Retry'
      : 'Test an Empfänger senden'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'var(--font-sans), sans-serif', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--ll-burgundy)', opacity: 0.6 }}>Status:</span>
        <span className={statusClassName}>{currentStatus}</span>
      </div>
      {!hasGeneratedText && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ll-orange)', fontFamily: 'var(--font-sans), sans-serif' }}>
          Kein generierter Text — bitte zuerst Text generieren.
        </p>
      )}
      {approveError && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--ll-orange)', fontFamily: 'var(--font-sans), sans-serif' }}>
          {approveError}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleApprove}
          disabled={approveDisabled}
          title={approveTitle}
          className={`ll-btn ll-btn--sm${approveState === 'done' ? ' ll-btn--yellow' : ''}`}
        >
          {approveLabel}
        </button>
        <button
          onClick={handleSendTest}
          disabled={sendState === 'loading'}
          className={`ll-btn ll-btn--sm ll-btn--ghost${sendState === 'done' ? ' ll-btn--yellow' : ''}`}
        >
          {sendLabel}
        </button>
      </div>
    </div>
  )
}
