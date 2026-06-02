export default function AdminPage() {
  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Admin</h1>
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
            border: '1px solid #ccc',
            color: '#111',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          All Orders
        </a>
      </nav>
    </main>
  )
}
