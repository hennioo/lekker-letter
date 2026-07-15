'use client'

import { useState } from 'react'

interface ScheduledMail {
  id: string
  send_date: string
  status: string
  generated_subject: string | null
  generated_text: string | null
  voucher_id: string | null
  vouchers: {
    title: string
    description: string | null
  } | null
}

function getSubject(mail: ScheduledMail): string | null {
  if (mail.generated_subject) return mail.generated_subject
  if (!mail.generated_text) return null
  try {
    const parsed = JSON.parse(mail.generated_text) as { subject?: string }
    return parsed.subject ?? null
  } catch {
    return null
  }
}

function mailHasText(mail: ScheduledMail): boolean {
  return !!(mail.generated_text || mail.generated_subject)
}

function statusClass(status: string): string {
  const key = status.toLowerCase()
  if (['draft', 'pending', 'approved', 'sent', 'failed', 'cancelled'].includes(key)) {
    return `ll-status ll-status--${key}`
  }
  return 'll-status ll-status--draft'
}

export default function ScheduledMailList({ mails }: { mails: ScheduledMail[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedOverrides, setGeneratedOverrides] = useState<Record<string, { subject: string }>>({})

  function hasText(mail: ScheduledMail): boolean {
    return !!(generatedOverrides[mail.id] || mailHasText(mail))
  }

  async function handleGenerate(mail: ScheduledMail) {
    if (!mail.vouchers) {
      setErrors((e) => ({ ...e, [mail.id]: 'Kein Voucher verknüpft' }))
      return
    }
    if (hasText(mail)) {
      const confirmed = window.confirm('Bereits generierter Text vorhanden. Wirklich überschreiben?')
      if (!confirmed) return
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
      const data = (await res.json()) as { success?: boolean; subject?: string; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Generation failed')
      setGeneratedOverrides((g) => ({ ...g, [mail.id]: { subject: data.subject ?? '' } }))
    } catch (err) {
      setErrors((e) => ({ ...e, [mail.id]: (err as Error).message }))
    } finally {
      setLoading((l) => ({ ...l, [mail.id]: false }))
    }
  }

  if (!mails.length) {
    return (
      <div
        className="ll-surface"
        style={{
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-serif), serif',
          fontStyle: 'italic',
          color: 'var(--ll-burgundy)',
          opacity: 0.7,
        }}
      >
        Keine geplanten Mails.
      </div>
    )
  }

  return (
    <div className="ll-table-wrap">
      <table className="ll-table" style={{ minWidth: 640 }}>
        <thead>
          <tr>
            <th>Send Date</th>
            <th>Status</th>
            <th>Voucher</th>
            <th>Betreff</th>
            <th aria-label="Aktionen" />
          </tr>
        </thead>
        <tbody>
          {mails.map((mail) => (
            <tr key={mail.id} style={{ cursor: 'default' }}>
              <td style={{ fontFamily: 'var(--font-serif), serif', fontWeight: 500 }}>{mail.send_date}</td>
              <td>
                <span className={statusClass(mail.status)}>{mail.status}</span>
              </td>
              <td>{mail.vouchers?.title ?? '—'}</td>
              <td style={{ fontFamily: 'var(--font-sans), sans-serif', color: 'var(--ll-burgundy)', opacity: 0.85 }}>
                {generatedOverrides[mail.id]?.subject ?? getSubject(mail) ?? (
                  <em style={{ opacity: 0.5 }}>nicht generiert</em>
                )}
                {errors[mail.id] && (
                  <div
                    style={{
                      color: 'var(--ll-orange)',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem',
                    }}
                  >
                    {errors[mail.id]}
                  </div>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleGenerate(mail)}
                    disabled={loading[mail.id]}
                    className="ll-btn ll-btn--sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {loading[mail.id] ? 'Generiere …' : 'Text generieren'}
                  </button>
                  {hasText(mail) && (
                    <a
                      href={`/admin/scheduled-mails/${mail.id}/preview`}
                      className="ll-btn ll-btn--sm ll-btn--ghost"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Preview
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
