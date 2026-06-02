'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function PreviewActions({ scheduledMailId }: { scheduledMailId: string }) {
  const [approveState, setApproveState] = useState<State>('idle')
  const [sendState, setSendState] = useState<State>('idle')

  async function handleApprove() {
    setApproveState('loading')
    try {
      const res = await fetch('/api/approve-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledMailId }),
      })
      if (!res.ok) throw new Error('Failed')
      setApproveState('done')
    } catch {
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

  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <button
        onClick={handleApprove}
        disabled={approveState === 'loading' || approveState === 'done'}
        style={{
          padding: '0.5rem 1.25rem',
          backgroundColor: approveState === 'done' ? '#2d7a3f' : approveState === 'error' ? '#c0392b' : approveState === 'loading' ? '#ccc' : '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: approveState === 'loading' || approveState === 'done' ? 'default' : 'pointer',
          fontSize: '0.9rem',
        }}
      >
        {approveState === 'loading' ? 'Approving…' : approveState === 'done' ? 'Approved ✓' : approveState === 'error' ? 'Error — Retry' : 'Approve'}
      </button>
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
  )
}
