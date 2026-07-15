import { LL_COLORS, PostmarkDoodle } from '../_components/doodles'

const { burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <main style={{ background: PAPER, minHeight: '100vh' }}>
      {/* Header strip */}
      <section
        style={{
          background: BURGUNDY,
          padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
          overflow: 'hidden',
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
          <a href="/">← Lekker Letter</a>
          <span>Admin</span>
        </nav>

        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.25 }}>
          <PostmarkDoodle size={80} color={YELLOW} />
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem' }}>
        <h1 className="ll-h1" style={{ marginBottom: '0.75rem' }}>
          Admin
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            color: BURGUNDY,
            opacity: 0.7,
            marginBottom: '2.5rem',
          }}
        >
          Backoffice für Bestellungen und Mail-Versand.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="/admin/orders/new" className="ll-btn">
            + Neue Bestellung
          </a>
          <a href="/admin/orders" className="ll-btn ll-btn--orange">
            Alle Bestellungen →
          </a>
        </div>
      </section>
    </main>
  )
}
