'use client'

import { useFormState } from 'react-dom'
import { createOrder } from './actions'

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
  fontSize: '0.9rem',
  fontWeight: 500,
}

const fieldsetStyle = {
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '1rem',
}

export default function NewOrderPage() {
  const [state, formAction] = useFormState(createOrder, null)

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <a href="/admin" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Admin
      </a>
      <h1 style={{ marginTop: '0.5rem' }}>New Order</h1>

      {state?.error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '4px',
          color: '#c0392b',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
        }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <fieldset style={fieldsetStyle}>
          <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Giver</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={labelStyle}>
              Name
              <input name="giver_name" type="text" required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Email
              <input name="giver_email" type="email" required style={inputStyle} />
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Recipient</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={labelStyle}>
              Name
              <input name="recipient_name" type="text" required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Email
              <input name="recipient_email" type="email" required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              City
              <input name="city" type="text" defaultValue="Köln" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Interests
              <textarea
                name="interests"
                placeholder="Weinbar, vegetarisches Essen, gemütliche Atmosphäre"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              Relationship to giver
              <input
                name="relationship_to_giver"
                type="text"
                placeholder="beste Freundin"
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Tone
              <select name="tone" defaultValue="warm & persönlich" style={inputStyle}>
                <option value="liebevoll & locker">liebevoll &amp; locker</option>
                <option value="warm & persönlich">warm &amp; persönlich</option>
                <option value="humorvoll & leicht">humorvoll &amp; leicht</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Order Details</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={labelStyle}>
              Occasion
              <input
                name="occasion"
                type="text"
                placeholder="Geburtstag"
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Start Date
              <input name="start_date" type="date" required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Duration (months)
              <select name="duration_months" defaultValue="3" style={inputStyle}>
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Create Order
        </button>
      </form>
    </main>
  )
}
