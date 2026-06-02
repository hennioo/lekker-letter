import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import ScheduledMailList from './ScheduledMailList'
import DeleteOrderButton from './DeleteOrderButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      giver_name,
      giver_email,
      occasion,
      duration_months,
      start_date,
      status,
      created_at,
      recipients (name, email, city, interests, relationship_to_giver, tone)
    `)
    .eq('id', params.id)
    .single()

  if (error || !order) notFound()

  const { data: mails, error: mailsError } = await supabaseAdmin
    .from('scheduled_mails')
    .select(`
      id,
      send_date,
      status,
      generated_subject,
      generated_text,
      voucher_id,
      vouchers (title, description)
    `)
    .eq('order_id', params.id)
    .order('send_date', { ascending: true })

  if (mailsError) {
    console.error('[admin/orders/[id]] Failed to load scheduled mails:', mailsError.message)
  }

  const recipient = order.recipients as unknown as {
    name: string
    email: string
    city: string | null
    interests: string | null
    relationship_to_giver: string | null
    tone: string | null
  } | null

  const dd: React.CSSProperties = { margin: 0, wordBreak: 'break-word', overflowWrap: 'anywhere' }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <a href="/admin/orders" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← All Orders
      </a>

      <h1 style={{ margin: '0.5rem 0 1.5rem' }}>Order Detail</h1>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '6px' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
          Order Info
        </h2>
        <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0.4rem 0', fontSize: '0.9rem' }}>
          <dt style={{ color: '#666' }}>Giver</dt>
          <dd style={dd}>{order.giver_name} ({order.giver_email})</dd>
          <dt style={{ color: '#666' }}>Occasion</dt>
          <dd style={dd}>{order.occasion ?? '—'}</dd>
          <dt style={{ color: '#666' }}>Duration</dt>
          <dd style={dd}>{order.duration_months} months</dd>
          <dt style={{ color: '#666' }}>Start Date</dt>
          <dd style={dd}>{order.start_date ?? '—'}</dd>
          <dt style={{ color: '#666' }}>Status</dt>
          <dd style={dd}>{order.status}</dd>
        </dl>
      </section>

      {recipient && (
        <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '6px' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
            Recipient
          </h2>
          <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0.4rem 0', fontSize: '0.9rem' }}>
            <dt style={{ color: '#666' }}>Name</dt>
            <dd style={dd}>{recipient.name}</dd>
            <dt style={{ color: '#666' }}>Email</dt>
            <dd style={dd}>{recipient.email}</dd>
            <dt style={{ color: '#666' }}>City</dt>
            <dd style={dd}>{recipient.city ?? '—'}</dd>
            <dt style={{ color: '#666' }}>Interests</dt>
            <dd style={dd}>{recipient.interests ?? '—'}</dd>
            <dt style={{ color: '#666' }}>Relationship</dt>
            <dd style={dd}>{recipient.relationship_to_giver ?? '—'}</dd>
            <dt style={{ color: '#666' }}>Tone</dt>
            <dd style={dd}>{recipient.tone ?? '—'}</dd>
          </dl>
        </section>
      )}

      <section>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
          Scheduled Mails
        </h2>
        {mailsError ? (
          <p style={{ color: 'red', fontSize: '0.9rem' }}>
            Error loading scheduled mails: {mailsError.message}
          </p>
        ) : (
          <ScheduledMailList mails={(mails ?? []) as unknown as Parameters<typeof ScheduledMailList>[0]['mails']} />
        )}
      </section>

      <DeleteOrderButton orderId={order.id} />
    </main>
  )
}
