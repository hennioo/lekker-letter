'use client'

import { useState } from 'react'

interface ScheduledMail {
  id: string
  send_date: string
  status: string
  generated_subject: string | null
  voucher_id: string | null
  vouchers: {
    title: string
    description: string | null
  } | null
}

export default function ScheduledMailList({ mails }: { mails: ScheduledMail[] }) {
  const [subjects, setSubjects] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const m of mails) {
      if (m.generated_subject) init[m.id] = m.generated_subject
    }
    return init
  })
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleGenerate(mail: ScheduledMail) {
    if (!mail.vouchers) {
      setErrors((e) => ({ ...e, [mail.id]: 'No voucher linked to this mail' }))
      return
    }
    setLoading((l) => ({ ...l, [mail.id]: true }))
    setErrors((e) => ({ ...e, [mail.id]: '' }))
    try {
      const res = await fetch('/api/generate-letter-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledMailId: mail.id,
          voucherTitle: mail.vouchers.title,
          voucherDescription: mail.vouchers.description ?? '',
        }),
      })
      const data = await res.json() as { success?: boolean; subject?: string; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Generation failed')
      setSubjects((s) => ({ ...s, [mail.id]: data.subject! }))
    } catch (err) {
      setErrors((e) => ({ ...e, [mail.id]: (err as Error).message }))
    } finally {
      setLoading((l) => ({ ...l, [mail.id]: false }))
    }
  }

  if (!mails.length) {
    return <p style={{ color: '#666' }}>No scheduled mails for this order.</p>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
          <th style={{ padding: '0.5rem' }}>Send Date</th>
          <th style={{ padding: '0.5rem' }}>Status</th>
          <th style={{ padding: '0.5rem' }}>Voucher</th>
          <th style={{ padding: '0.5rem' }}>Generated Subject</th>
          <th style={{ padding: '0.5rem' }}></th>
        </tr>
      </thead>
      <tbody>
        {mails.map((mail) => (
          <tr key={mail.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '0.5rem' }}>{mail.send_date}</td>
            <td style={{ padding: '0.5rem' }}>{mail.status}</td>
            <td style={{ padding: '0.5rem' }}>{mail.vouchers?.title ?? '—'}</td>
            <td style={{ padding: '0.5rem', color: subjects[mail.id] ? '#111' : '#aaa' }}>
              {subjects[mail.id] ?? 'Not generated'}
              {errors[mail.id] && (
                <span style={{ color: 'red', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                  {errors[mail.id]}
                </span>
              )}
            </td>
            <td style={{ padding: '0.5rem' }}>
              <button
                onClick={() => handleGenerate(mail)}
                disabled={loading[mail.id]}
                style={{
                  padding: '0.3rem 0.75rem',
                  backgroundColor: loading[mail.id] ? '#ccc' : '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading[mail.id] ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading[mail.id] ? 'Generating…' : 'Generate Text'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
