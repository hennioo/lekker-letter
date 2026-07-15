import { supabaseAdmin } from '@/lib/supabase-admin'
import { LL_COLORS, WaxSealDoodle, StarDoodle, HeartDoodle } from '../../_components/doodles'

const { orange: ORANGE, burgundy: BURGUNDY, pink: PINK, yellow: YELLOW, paper: PAPER } = LL_COLORS

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
      <main
        style={{
          minHeight: '100vh',
          background: PAPER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.2rem', color: BURGUNDY }}>
          Geschenk nicht gefunden
        </p>
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
    <main style={{ background: PAPER, minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          background: PINK,
          padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem) clamp(3rem, 7vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <nav
          className="ll-nav"
          style={{
            fontFamily: 'var(--font-sans), system-ui, sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.25em',
            color: BURGUNDY,
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          <a href="/">Lekker Letter</a>
          <span>Für dich</span>
        </nav>

        <div style={{ maxWidth: 640, margin: 'clamp(2rem, 5vw, 3.5rem) auto 0', position: 'relative' }}>
          <div
            className="ll-sway"
            style={{
              position: 'absolute',
              top: '-0.5rem',
              left: '8%',
              // @ts-expect-error CSS custom property
              '--ll-rot': '-10deg',
              transform: 'rotate(-10deg)',
            }}
          >
            <StarDoodle size={48} color={ORANGE} />
          </div>
          <div
            className="ll-sway--reverse"
            style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '8%',
              // @ts-expect-error CSS custom property
              '--ll-rot': '14deg',
              transform: 'rotate(14deg)',
            }}
          >
            <StarDoodle size={40} color={BURGUNDY} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <WaxSealDoodle size={80} />
          </div>

          <h1 className="ll-h1" style={{ margin: 0 }}>
            Hey {recipient?.name ?? 'du'},
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans), system-ui, sans-serif',
              fontSize: '1.05rem',
              color: BURGUNDY,
              lineHeight: 1.65,
              margin: '1.25rem auto 1.5rem',
              maxWidth: 460,
            }}
          >
            {order.giver_name} hat dir <strong>{order.duration_months}</strong>{' '}
            besondere Überraschungen zusammengestellt.
          </p>
          <span
            style={{
              display: 'inline-block',
              background: BURGUNDY,
              color: YELLOW,
              borderRadius: '999px',
              padding: '0.45rem 1.25rem',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-sans), system-ui, sans-serif',
              letterSpacing: '0.05em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {occasionEmoji} {occasionLabel}
          </span>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem 0' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          {mailsError ? (
            <p style={{ fontFamily: 'var(--font-sans), sans-serif', color: ORANGE }}>
              Überraschungen konnten nicht geladen werden
            </p>
          ) : (
            (mails ?? []).map((mail, index) => {
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
                    <div
                      style={{
                        borderLeft: `1px dashed ${BURGUNDY}`,
                        height: 28,
                        marginLeft: 24,
                        opacity: 0.4,
                      }}
                    />
                  )}

                  {isOpen ? (
                    <div
                      className="ll-surface"
                      style={{
                        background: PAPER,
                        borderColor: BURGUNDY,
                        borderLeft: `4px solid ${ORANGE}`,
                        padding: '1.5rem 1.75rem',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-sans), sans-serif',
                          fontSize: '0.72rem',
                          color: ORANGE,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {monthYear}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-serif), serif',
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: BURGUNDY,
                          letterSpacing: '-0.02em',
                          marginBottom: '0.35rem',
                        }}
                      >
                        {voucher?.title ?? 'Überraschung'}
                      </div>
                      {(voucher?.partner_name || voucher?.city) && (
                        <div
                          style={{
                            fontFamily: 'var(--font-sans), sans-serif',
                            fontSize: '0.9rem',
                            color: BURGUNDY,
                            opacity: 0.7,
                            marginBottom: '1rem',
                          }}
                        >
                          {[voucher.partner_name, voucher.city].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <span
                        style={{
                          display: 'inline-block',
                          background: YELLOW,
                          color: BURGUNDY,
                          borderRadius: '999px',
                          padding: '0.25rem 0.85rem',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-sans), sans-serif',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        Verfügbar ✓
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        border: `1.5px dashed ${BURGUNDY}`,
                        borderRadius: 6,
                        padding: '1.5rem 1.75rem',
                        background: 'transparent',
                        opacity: 0.75,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-sans), sans-serif',
                          fontSize: '0.72rem',
                          color: BURGUNDY,
                          opacity: 0.65,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {monthYear}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-serif), serif',
                          fontSize: '1.1rem',
                          fontStyle: 'italic',
                          color: BURGUNDY,
                          opacity: 0.7,
                          marginBottom: '0.75rem',
                        }}
                      >
                        ✦ Deine Überraschung
                      </div>
                      <span
                        style={{
                          color: ORANGE,
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-sans), sans-serif',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {days <= 0 ? 'In Kürze' : `In ${days} ${days === 1 ? 'Tag' : 'Tagen'}`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem clamp(2rem, 4vw, 3rem)',
          fontFamily: 'var(--font-sans), sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <HeartDoodle size={32} color={ORANGE} />
        </div>
        <p
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: BURGUNDY,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Zusammengestellt in Köln
        </p>
      </footer>
    </main>
  )
}
