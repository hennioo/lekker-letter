import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import ScheduledMailList from './ScheduledMailList'
import DeleteOrderButton from './DeleteOrderButton'
import { LL_COLORS } from '../../../_components/doodles'

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS

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
          <span>Detail</span>
        </nav>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem 4rem' }}>
        <h1 className="ll-h1" style={{ marginBottom: '0.35rem' }}>
          {order.giver_name}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            color: BURGUNDY,
            opacity: 0.6,
            fontSize: '0.95rem',
            marginBottom: '2.5rem',
          }}
        >
          für {recipient?.name ?? '—'} · {order.occasion ?? 'kein Anlass'} ·{' '}
          <span className={`ll-status ll-status--${order.status.toLowerCase()}`}>{order.status}</span>
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <DetailCard title="Bestellung">
            <DetailRow label="Giver Email" value={order.giver_email} />
            <DetailRow label="Anlass" value={order.occasion ?? '—'} />
            <DetailRow label="Dauer" value={`${order.duration_months} Monate`} />
            <DetailRow label="Startdatum" value={order.start_date ?? '—'} />
            <DetailRow label="Status" value={order.status} />
          </DetailCard>

          {recipient && (
            <DetailCard title="Empfänger">
              <DetailRow label="Name" value={recipient.name} />
              <DetailRow label="Email" value={recipient.email} />
              <DetailRow label="Stadt" value={recipient.city ?? '—'} />
              <DetailRow label="Interessen" value={recipient.interests ?? '—'} />
              <DetailRow label="Beziehung" value={recipient.relationship_to_giver ?? '—'} />
              <DetailRow label="Tonalität" value={recipient.tone ?? '—'} />
            </DetailCard>
          )}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: '1.35rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: BURGUNDY,
            marginBottom: '1rem',
          }}
        >
          Scheduled Mails
        </h2>
        {mailsError ? (
          <p style={{ color: ORANGE, fontFamily: 'var(--font-sans), sans-serif', fontSize: '0.9rem' }}>
            Fehler beim Laden: {mailsError.message}
          </p>
        ) : (
          <ScheduledMailList
            mails={(mails ?? []) as unknown as Parameters<typeof ScheduledMailList>[0]['mails']}
          />
        )}

        <DeleteOrderButton orderId={order.id} />
      </section>
    </main>
  )
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ll-surface">
      <h3
        style={{
          fontFamily: 'var(--font-sans), sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: LL_COLORS.orange,
          fontWeight: 600,
          marginBottom: '1rem',
        }}
      >
        {title}
      </h3>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gap: '0.5rem 0.75rem',
          fontSize: '0.9rem',
          margin: 0,
        }}
      >
        {children}
      </dl>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt
        style={{
          fontFamily: 'var(--font-sans), sans-serif',
          color: LL_COLORS.burgundy,
          opacity: 0.55,
          fontSize: '0.8rem',
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans), sans-serif',
          color: LL_COLORS.burgundy,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </dd>
    </>
  )
}
