'use client'

import { useFormState } from 'react-dom'
import { createOrder } from './actions'
import { LL_COLORS } from '../../../_components/doodles'

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS

export default function NewOrderPage() {
  const [state, formAction] = useFormState(createOrder, null)

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
          <span>Neue Bestellung</span>
        </nav>
      </section>

      <section style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem 4rem' }}>
        <h1 className="ll-h1" style={{ marginBottom: '0.5rem' }}>
          Neue Bestellung
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            color: BURGUNDY,
            opacity: 0.65,
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}
        >
          Manuelles Anlegen (nur für Admins).
        </p>

        {state?.error && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              background: 'rgba(239, 68, 22, 0.1)',
              border: `1.5px solid ${ORANGE}`,
              borderRadius: 6,
              color: BURGUNDY,
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            {state.error}
          </div>
        )}

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AdminFieldset legend="Giver">
            <AdminField label="Name">
              <input name="giver_name" type="text" required className="ll-input" />
            </AdminField>
            <AdminField label="Email">
              <input name="giver_email" type="email" required className="ll-input" />
            </AdminField>
          </AdminFieldset>

          <AdminFieldset legend="Recipient">
            <AdminField label="Name">
              <input name="recipient_name" type="text" required className="ll-input" />
            </AdminField>
            <AdminField label="Email">
              <input name="recipient_email" type="email" required className="ll-input" />
            </AdminField>
            <AdminField label="City">
              <input name="city" type="text" defaultValue="Köln" className="ll-input" />
            </AdminField>
            <AdminField label="Interests">
              <textarea
                name="interests"
                placeholder="Weinbar, vegetarisches Essen, gemütliche Atmosphäre"
                rows={3}
                className="ll-input"
                style={{ resize: 'vertical' }}
              />
            </AdminField>
            <AdminField label="Relationship to giver">
              <input
                name="relationship_to_giver"
                type="text"
                placeholder="beste Freundin"
                className="ll-input"
              />
            </AdminField>
            <AdminField label="Tone">
              <select name="tone" defaultValue="warm & persönlich" className="ll-input">
                <option value="liebevoll & locker">liebevoll &amp; locker</option>
                <option value="warm & persönlich">warm &amp; persönlich</option>
                <option value="humorvoll & leicht">humorvoll &amp; leicht</option>
              </select>
            </AdminField>
          </AdminFieldset>

          <AdminFieldset legend="Order Details">
            <AdminField label="Occasion">
              <input name="occasion" type="text" placeholder="Geburtstag" required className="ll-input" />
            </AdminField>
            <AdminField label="Start Date">
              <input name="start_date" type="date" required className="ll-input" />
            </AdminField>
            <AdminField label="Duration (months)">
              <select name="duration_months" defaultValue="3" className="ll-input">
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </AdminField>
          </AdminFieldset>

          <button type="submit" className="ll-btn" style={{ width: '100%' }}>
            Bestellung anlegen →
          </button>
        </form>
      </section>
    </main>
  )
}

function AdminFieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset
      style={{
        border: `1.5px solid ${LL_COLORS.burgundy}22`,
        borderRadius: 6,
        padding: '1.5rem',
        background: LL_COLORS.paper,
      }}
    >
      <legend
        style={{
          padding: '0 0.6rem',
          fontFamily: 'var(--font-sans), sans-serif',
          fontWeight: 600,
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: LL_COLORS.orange,
        }}
      >
        {legend}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>{children}</div>
    </fieldset>
  )
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <span className="ll-label" style={{ marginBottom: 0 }}>
        {label}
      </span>
      {children}
    </label>
  )
}
