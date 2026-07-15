import { render } from '@react-email/components'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import LekkerLetterEmail from '@/emails/LekkerLetterEmail'
import PreviewActions from './PreviewActions'
import { LL_COLORS } from '../../../../_components/doodles'

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS

function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export default async function PreviewPage({ params }: PageProps) {
  const { data: mail, error } = await supabaseAdmin
    .from('scheduled_mails')
    .select(`
      id,
      send_date,
      status,
      generated_text,
      recipients (name, email),
      vouchers (title, partner_name, city, address, voucher_code, valid_until)
    `)
    .eq('id', params.id)
    .single()

  if (error || !mail) notFound()

  const recipient = mail.recipients as unknown as { name: string; email: string } | null
  const voucher = mail.vouchers as unknown as {
    title: string
    partner_name: string
    city: string
    address: string
    voucher_code: string
    valid_until: string
  } | null

  let generated: { subject?: string; intro?: string; voucher_transition?: string; closing?: string } = {}
  if (mail.generated_text) {
    try {
      generated = JSON.parse(mail.generated_text as string)
    } catch {
      // ignore malformed JSON
    }
  }

  const emailHtml = await render(
    LekkerLetterEmail({
      recipientName: recipient?.name,
      subject: generated.subject,
      intro: generated.intro,
      voucherTransition: generated.voucher_transition,
      closing: generated.closing,
      voucherTitle: voucher?.title,
      voucherPartner: voucher ? [voucher.partner_name, voucher.city].filter(Boolean).join(', ') : undefined,
      voucherAddress: voucher?.address,
      voucherCode: voucher?.voucher_code,
      voucherValidUntil: voucher?.valid_until ? formatDateDE(voucher.valid_until) : undefined,
    })
  )

  return (
    <main style={{ background: PAPER, minHeight: '100vh' }}>
      {/* Header strip */}
      <section
        style={{
          background: BURGUNDY,
          padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)',
        }}
      >
        <nav
          className="ll-nav"
          style={{
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.25em',
            color: YELLOW,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          <a href="/admin/orders">← Alle Bestellungen</a>
          <span>Mail-Preview</span>
        </nav>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem 4rem' }}>
        <h1 className="ll-h1" style={{ marginBottom: '2rem' }}>
          Mail-Preview
        </h1>

        <div className="ll-surface" style={{ marginBottom: '1.5rem' }}>
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: '0.5rem 0.75rem',
              margin: 0,
              fontSize: '0.9rem',
            }}
          >
            <dt style={{ color: BURGUNDY, opacity: 0.55, fontSize: '0.8rem' }}>Recipient</dt>
            <dd style={{ margin: 0, color: BURGUNDY }}>
              {recipient?.name ?? '—'}
              {recipient?.email ? ` (${recipient.email})` : ''}
            </dd>
            <dt style={{ color: BURGUNDY, opacity: 0.55, fontSize: '0.8rem' }}>Send Date</dt>
            <dd style={{ margin: 0, color: BURGUNDY }}>{mail.send_date}</dd>
            <dt style={{ color: BURGUNDY, opacity: 0.55, fontSize: '0.8rem' }}>Voucher</dt>
            <dd style={{ margin: 0, color: BURGUNDY }}>{voucher?.title ?? '—'}</dd>
            <dt style={{ color: BURGUNDY, opacity: 0.55, fontSize: '0.8rem' }}>Betreff</dt>
            <dd style={{ margin: 0, color: BURGUNDY, fontFamily: 'var(--font-serif), serif', fontWeight: 500 }}>
              {generated.subject ?? '—'}
            </dd>
          </dl>
        </div>

        <PreviewActions
          scheduledMailId={params.id}
          initialStatus={mail.status}
          hasGeneratedText={!!mail.generated_text}
        />

        <h2
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: ORANGE,
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Email Preview
        </h2>
        <iframe
          srcDoc={emailHtml}
          style={{
            width: '100%',
            height: '720px',
            border: `1.5px solid rgba(120, 2, 40, 0.18)`,
            borderRadius: '6px',
            background: '#fff',
          }}
          title="Email preview"
        />
      </section>
    </main>
  )
}
