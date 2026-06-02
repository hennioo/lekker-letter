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
        const data = await res.json().catch(() => null) as { error?: string } | null
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
    console.log('[PreviewActions] handleSendTest called, scheduledMailId =', scheduledMailId)
    setSendState('loading')
    try {
      const res = await fetch('/api/send-test-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledMailId }),
      })
      console.log('[PreviewActions] Response status:', res.status)
      const responseBody = await res.json().catch(() => null)
      console.log('[PreviewActions] Response body:', responseBody)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(responseBody)}`)
      setSendState('done')
    } catch (err) {
      console.error('[PreviewActions] handleSendTest error:', err)
      setSendState('error')
    }
  }

  const statusColor: Record<string, string> = {
    draft: '#888',
    pending: '#d97706',
    approved: '#2d7a3f',
    sent: '#1a5c8a',
    failed: '#c0392b',
    cancelled: '#888',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.85rem' }}>
        Status:{' '}
        <span style={{ color: statusColor[currentStatus] ?? '#888', fontWeight: 600 }}>
          {currentStatus}
        </span>
      </div>
      {!hasGeneratedText && (
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#c0392b' }}>
          Kein generierter Text vorhanden — bitte zuerst Text generieren.
        </p>
      )}
      {approveError && (
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#c0392b' }}>
          {approveError}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
      {(() => {
        const alreadyFinal = currentStatus === 'sent' || currentStatus === 'approved' || currentStatus === 'cancelled'
        const isDisabled = !hasGeneratedText || alreadyFinal || approveState === 'loading' || approveState === 'done'
        const title = !hasGeneratedText
          ? 'Zuerst Text generieren'
          : alreadyFinal
          ? `Mail ist bereits ${currentStatus}`
          : undefined
        const bg = approveState === 'done' ? '#2d7a3f'
          : approveState === 'error' ? '#c0392b'
          : isDisabled ? '#ccc'
          : '#111'
        const label = approveState === 'loading' ? 'Approving…'
          : approveState === 'done' ? 'Approved ✓'
          : currentStatus === 'sent' ? 'Bereits versendet'
          : currentStatus === 'approved' ? 'Bereits approved'
          : currentStatus === 'cancelled' ? 'Abgebrochen'
          : approveState === 'error' ? 'Fehler — Retry'
          : 'Approve'
        return (
          <button
            onClick={handleApprove}
            disabled={isDisabled}
            title={title}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: bg,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {label}
          </button>
        )
      })()}
      <button
        onClick={handleSendTest}
        disabled={sendState === 'loading'}
        style={{
          padding: '0.5rem 1.25rem',
          backgroundColor: sendState === 'done' ? '#2d7a3f' : sendState === 'error' ? '#c0392b' : sendState === 'loading' ? '#ccc' : '#1a5c8a',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: sendState === 'loading' ? 'default' : 'pointer',
          fontSize: '0.9rem',
        }}
      >
        {sendState === 'loading' ? 'Sending…' : sendState === 'done' ? 'Sent ✓' : sendState === 'error' ? 'Error — Retry' : 'Send Test Mail'}
      </button>
      </div>
    </div>
  )
}
