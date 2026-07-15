'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Order {
  id: string
  giver_name: string
  occasion: string | null
  start_date: string | null
  status: string
  recipients: { name: string } | null
}

function statusClass(status: string): string {
  const key = status.toLowerCase()
  if (['draft', 'pending', 'approved', 'sent', 'failed', 'cancelled'].includes(key)) {
    return `ll-status ll-status--${key}`
  }
  return 'll-status ll-status--draft'
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [])

  return (
    <div className="ll-table-wrap">
      <table className="ll-table">
        <thead>
          <tr>
            <th>Giver</th>
            <th>Recipient</th>
            <th>Anlass</th>
            <th>Startdatum</th>
            <th>Status</th>
            <th aria-label="Detail" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} onClick={() => router.push(`/admin/orders/${order.id}`)}>
              <td style={{ fontFamily: 'var(--font-serif), serif', fontWeight: 500 }}>
                {order.giver_name}
              </td>
              <td>{order.recipients?.name ?? '—'}</td>
              <td>{order.occasion ?? '—'}</td>
              <td>{order.start_date ?? '—'}</td>
              <td>
                <span className={statusClass(order.status)}>{order.status}</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif), serif',
                    color: 'var(--ll-orange)',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  Öffnen →
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
