import { render } from '@react-email/components'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import LekkerLetterEmail from '@/emails/LekkerLetterEmail'
import PreviewActions from './PreviewActions'

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
      voucherPartner: voucher ? `${voucher.partner_name}, ${voucher.city}` : undefined,
      voucherAddress: voucher?.address,
      voucherCode: voucher?.voucher_code,
      voucherValidUntil: voucher?.valid_until,
    })
  )

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <a href="/admin/orders" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← All Orders
      </a>

      <h1 style={{ margin: '0.5rem 0 1.5rem' }}>Email Preview</h1>

      <section style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '6px', fontSize: '0.9rem' }}>
        <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.4rem 0', margin: 0 }}>
          <dt style={{ color: '#666' }}>Recipient</dt>
          <dd style={{ margin: 0 }}>
            {recipient?.name ?? '—'}{recipient?.email ? ` (${recipient.email})` : ''}
          </dd>
          <dt style={{ color: '#666' }}>Send Date</dt>
          <dd style={{ margin: 0 }}>{mail.send_date}</dd>
          <dt style={{ color: '#666' }}>Status</dt>
          <dd style={{ margin: 0 }}>{mail.status}</dd>
          <dt style={{ color: '#666' }}>Voucher</dt>
          <dd style={{ margin: 0 }}>{voucher?.title ?? '—'}</dd>
          <dt style={{ color: '#666' }}>Subject</dt>
          <dd style={{ margin: 0 }}>{generated.subject ?? '—'}</dd>
        </dl>
      </section>

      <PreviewActions scheduledMailId={params.id} />

      <h2 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999' }}>
        Email Preview
      </h2>
      <iframe
        srcDoc={emailHtml}
        style={{ width: '100%', height: '720px', border: '1px solid #e8e8e0', borderRadius: '6px', background: '#f5f5f0' }}
        title="Email preview"
      />
    </main>
  )
}
