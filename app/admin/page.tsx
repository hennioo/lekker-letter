export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <a
        href="/"
        style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}
      >
        ← lekker-letter.de
      </a>
      <h1 style={{ marginTop: '0.5rem' }}>Admin</h1>
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <a
          href="/admin/orders/new"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#111',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          + New Order
        </a>
        <a
          href="/admin/orders"
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#c8b89a',
            color: '#0f0f0f',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          All Orders
        </a>
      </nav>
    </main>
  )
}
