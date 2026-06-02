import { supabaseAdmin } from '@/lib/supabase'
import OrdersTable from './OrdersTable'
import SendDueMailsButton from './SendDueMailsButton'

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
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <a href="/admin" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Admin
          </a>
          <h1 style={{ margin: '0.25rem 0 0' }}>All Orders</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <SendDueMailsButton />
          <a
            href="/admin/orders/new"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#111',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
          >
            + New Order
          </a>
        </div>
      </div>

      {error && (
        <p style={{ color: 'red' }}>Error loading orders: {error.message}</p>
      )}

      {!orders?.length ? (
        <p style={{ color: '#666' }}>No orders yet.</p>
      ) : (
        <OrdersTable orders={orders.map((o) => ({ ...o, recipients: (o.recipients as unknown as { name: string } | null) }))} />
      )}
    </main>
  )
}
