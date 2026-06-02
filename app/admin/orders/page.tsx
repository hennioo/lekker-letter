import { supabaseAdmin } from '@/lib/supabase'

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

      {error && (
        <p style={{ color: 'red' }}>Error loading orders: {error.message}</p>
      )}

      {!orders?.length ? (
        <p style={{ color: '#666' }}>No orders yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Giver</th>
              <th style={{ padding: '0.5rem' }}>Recipient</th>
              <th style={{ padding: '0.5rem' }}>Occasion</th>
              <th style={{ padding: '0.5rem' }}>Start Date</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{order.giver_name}</td>
                <td style={{ padding: '0.5rem' }}>{(order.recipients as { name: string } | null)?.name ?? '—'}</td>
                <td style={{ padding: '0.5rem' }}>{order.occasion}</td>
                <td style={{ padding: '0.5rem' }}>{order.start_date}</td>
                <td style={{ padding: '0.5rem' }}>{order.status}</td>
                <td style={{ padding: '0.5rem' }}>
                  <a href={`/admin/orders/${order.id}`} style={{ color: '#111', fontSize: '0.85rem' }}>
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
