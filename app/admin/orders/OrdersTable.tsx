'use client'

import { useRouter } from 'next/navigation'

interface Order {
  id: string
  giver_name: string
  occasion: string | null
  start_date: string | null
  status: string
  recipients: { name: string } | null
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: 520 }}>
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
          <tr
            key={order.id}
            onClick={() => router.push(`/admin/orders/${order.id}`)}
            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
          >
            <td style={{ padding: '0.5rem' }}>{order.giver_name}</td>
            <td style={{ padding: '0.5rem' }}>{order.recipients?.name ?? '—'}</td>
            <td style={{ padding: '0.5rem' }}>{order.occasion ?? '—'}</td>
            <td style={{ padding: '0.5rem' }}>{order.start_date ?? '—'}</td>
            <td style={{ padding: '0.5rem' }}>{order.status}</td>
            <td style={{ padding: '0.5rem' }}>
              <span style={{ color: '#0066cc', fontSize: '0.85rem', fontWeight: 500 }}>
                View →
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}
