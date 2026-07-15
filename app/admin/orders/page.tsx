import { supabaseAdmin } from '@/lib/supabase-admin'
import OrdersTable from './OrdersTable'
import SendDueMailsButton from './SendDueMailsButton'
import { LL_COLORS } from '../../_components/doodles'

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      giver_name,
      occasion,
      start_date,
      status,
      created_at,
      recipients (name)
    `)
    .order('created_at', { ascending: false })

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
          <a href="/admin">← Admin</a>
          <span>Bestellungen</span>
        </nav>
      </section>

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="ll-h1" style={{ marginBottom: '0.35rem' }}>
              Bestellungen
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                color: BURGUNDY,
                opacity: 0.6,
                fontSize: '0.95rem',
              }}
            >
              {orders?.length ?? 0}{' '}
              {orders?.length === 1 ? 'Bestellung' : 'Bestellungen'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <SendDueMailsButton />
            <a href="/admin/orders/new" className="ll-btn ll-btn--sm">
              + Neue Bestellung
            </a>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: ORANGE,
              fontFamily: 'var(--font-sans), sans-serif',
              marginBottom: '1rem',
            }}
          >
            Fehler beim Laden: {error.message}
          </p>
        )}

        {!orders?.length ? (
          <div
            className="ll-surface"
            style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              fontFamily: 'var(--font-serif), serif',
              fontStyle: 'italic',
              color: BURGUNDY,
              opacity: 0.7,
              fontSize: '1.1rem',
            }}
          >
            Noch keine Bestellungen.
          </div>
        ) : (
          <OrdersTable
            orders={orders.map((o) => ({
              ...o,
              recipients: o.recipients as unknown as { name: string } | null,
            }))}
          />
        )}
      </section>
    </main>
  )
}
