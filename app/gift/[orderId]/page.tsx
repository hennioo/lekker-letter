import { supabaseAdmin } from '@/lib/supabase'

interface PageProps {
  params: { orderId: string }
}

const OCCASION_EMOJI: Record<string, string> = {
  Geburtstag: '🎂',
  Freundschaft: '💛',
  Danke: '🙏',
  'Einfach so': '✨',
}

function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
}

function daysUntil(dateStr: string, today: Date): number {
  const target = new Date(dateStr + 'T00:00:00')
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function GiftPage({ params }: PageProps) {
  const { orderId } = params

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      giver_name,
      occasion,
      duration_months,
      recipients (name)
    `)
    .eq('id', orderId)
    .single()

  if (!order) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#f5f0e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}>
        <p style={{ fontSize: '1.1rem', color: '#a09880' }}>Geschenk nicht gefunden</p>
      </main>
    )
  }

  const { data: mails, error: mailsError } = await supabaseAdmin
    .from('scheduled_mails')
    .select(`
      id,
      send_date,
      status,
      vouchers (title, partner_name, city)
    `)
    .eq('order_id', orderId)
    .order('send_date', { ascending: true })

  const recipient = order.recipients as unknown as { name: string } | null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const occasionLabel = order.occasion ?? 'Besonderer Anlass'
  const occasionEmoji = OCCASION_EMOJI[occasionLabel] ?? '✨'

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: '#f5f0e8',
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <a href="/" style={{
            color: '#f5f0e8',
            textDecoration: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 500,
          }}>
            LEKKER LETTER
          </a>
        </header>

        {/* Personal Greeting */}
        <section style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
            fontWeight: 400,
            margin: '0 0 0.8rem',
            lineHeight: 1.2,
            color: '#f5f0e8',
          }}>
            Hey {recipient?.name ?? 'du'},
          </h1>
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.75,
            margin: '0 0 1.25rem',
            color: '#d4cfc6',
            fontFamily: 'system-ui, sans-serif',
          }}>
            {order.giver_name} hat dir {order.duration_months} besondere Überraschungen zusammengestellt.
          </p>
          <span style={{
            display: 'inline-block',
            background: 'rgba(200, 169, 110, 0.12)',
            color: '#c8a96e',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            borderRadius: '999px',
            padding: '0.3rem 1rem',
            fontSize: '0.85rem',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.02em',
          }}>
            {occasionEmoji} {occasionLabel}
          </span>
        </section>

        {/* Timeline */}
        <section>
          {mailsError ? (
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.9rem',
              color: '#4a4540',
              padding: '1rem 0',
            }}>
              Überraschungen konnten nicht geladen werden
            </p>
          ) : (mails ?? []).map((mail, index) => {
            const isOpen = mail.status === 'sent'
            const days = daysUntil(mail.send_date, today)
            const voucher = mail.vouchers as unknown as {
              title: string | null
              partner_name: string | null
              city: string | null
            } | null
            const monthYear = formatMonthYear(mail.send_date)

            return (
              <div key={mail.id}>
                {index > 0 && (
                  <div style={{
                    borderLeft: '1px solid #c8a96e',
                    height: 24,
                    marginLeft: 20,
                    opacity: 0.35,
                  }} />
                )}

                {isOpen ? (
                  <div style={{
                    background: 'rgba(200, 169, 110, 0.05)',
                    border: '1px solid rgba(200, 169, 110, 0.2)',
                    borderLeft: '3px solid #c8a96e',
                    borderRadius: 8,
                    padding: '1.25rem 1.5rem',
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      color: '#a09880',
                      marginBottom: '0.4rem',
                      fontFamily: 'system-ui, sans-serif',
                      letterSpacing: '0.03em',
                    }}>
                      {monthYear}
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '0.3rem',
                      color: '#f5f0e8',
                    }}>
                      {voucher?.title ?? 'Überraschung'}
                    </div>
                    {(voucher?.partner_name || voucher?.city) && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#a09880',
                        marginBottom: '0.85rem',
                        fontFamily: 'system-ui, sans-serif',
                      }}>
                        {[voucher.partner_name, voucher.city].filter(Boolean).join(' · ')}
                      </div>
                    )}
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(74, 222, 128, 0.08)',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.2)',
                      borderRadius: '999px',
                      padding: '0.2rem 0.75rem',
                      fontSize: '0.75rem',
                      fontFamily: 'system-ui, sans-serif',
                      letterSpacing: '0.02em',
                    }}>
                      Verfügbar ✓
                    </span>
                  </div>
                ) : (
                  <div style={{
                    border: '1px dashed rgba(200, 169, 110, 0.2)',
                    background: '#141414',
                    borderRadius: 8,
                    padding: '1.25rem 1.5rem',
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      color: '#6b6355',
                      marginBottom: '0.4rem',
                      fontFamily: 'system-ui, sans-serif',
                      letterSpacing: '0.03em',
                    }}>
                      {monthYear}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      color: '#5a5248',
                      marginBottom: '0.8rem',
                    }}>
                      ✦ Deine Überraschung
                    </div>
                    <span style={{
                      color: '#c8a96e',
                      fontSize: '0.85rem',
                      fontFamily: 'system-ui, sans-serif',
                    }}>
                      {days <= 0 ? 'In Kürze' : `In ${days} ${days === 1 ? 'Tag' : 'Tagen'}`}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '4rem',
          color: '#a09880',
          fontSize: '0.8rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Mit ♥ zusammengestellt in Köln
        </footer>

      </div>
    </main>
  )
}
