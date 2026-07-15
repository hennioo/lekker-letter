"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LL_COLORS, WaxSealDoodle, EnvelopeDoodle, StarDoodle } from "../../_components/doodles";
import Confetti from "../../_components/Confetti";

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS;

interface Props {
  orderId: string;
  recipientName: string;
  giverName: string;
  durationMonths: number;
  startDate: string;
}

interface ScheduledMail {
  id: string;
  send_date: string;
  vouchers: { title: string } | null;
}

function formatDate(iso: string): string {
  if (!iso) return "–";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

export default function ConfirmationClient({
  orderId,
  recipientName,
  giverName,
  durationMonths,
  startDate,
}: Props) {
  const [mails, setMails] = useState<ScheduledMail[]>([]);
  const [loadingMails, setLoadingMails] = useState(true);
  const [mailsError, setMailsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMails() {
      const { data, error } = await supabase
        .from("scheduled_mails")
        .select("id, send_date, vouchers(title)")
        .eq("order_id", orderId)
        .order("send_date", { ascending: true });

      if (error || !data) {
        setMailsError("Mails konnten nicht geladen werden");
      } else {
        setMails(data as unknown as ScheduledMail[]);
      }
      setLoadingMails(false);
    }
    fetchMails();
  }, [orderId]);

  return (
    <main style={{ background: PAPER, minHeight: "100vh" }}>
      <Confetti />

      {/* Hero */}
      <section
        style={{
          background: ORANGE,
          padding: "clamp(1.25rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem) clamp(3rem, 7vw, 5rem)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <nav
          className="ll-nav"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            color: YELLOW,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <a href="/">Lekker Letter</a>
          <span>Alles bereit</span>
        </nav>

        <div
          style={{
            maxWidth: 640,
            margin: "clamp(2rem, 5vw, 3rem) auto 0",
            position: "relative",
          }}
        >
          <div
            className="ll-sway"
            style={{
              position: "absolute",
              top: "-0.5rem",
              left: "10%",
              // @ts-expect-error CSS custom property
              "--ll-rot": "-12deg",
              transform: "rotate(-12deg)",
            }}
          >
            <StarDoodle size={48} color={YELLOW} />
          </div>
          <div
            className="ll-sway--reverse"
            style={{
              position: "absolute",
              top: "-0.5rem",
              right: "10%",
              // @ts-expect-error CSS custom property
              "--ll-rot": "16deg",
              transform: "rotate(16deg)",
            }}
          >
            <StarDoodle size={40} color={BURGUNDY} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <WaxSealDoodle size={80} />
          </div>

          <h1 className="ll-h1" style={{ margin: 0 }}>
            Dein Geschenk
            <br />
            läuft!
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "1.05rem",
              color: BURGUNDY,
              lineHeight: 1.6,
              margin: "1.25rem auto 0",
              maxWidth: 460,
            }}
          >
            {durationMonths} {durationMonths === 1 ? "Monat" : "Monate"} für{" "}
            <strong>{recipientName}</strong> — los geht&apos;s. {giverName} hat alles vorbereitet.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section
        style={{
          padding: "clamp(2.5rem, 5vw, 4rem) 1.5rem 0",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div className="ll-surface ll-surface--pink" style={{ marginBottom: "2.5rem" }}>
            {[
              ["Erste Mail", formatDate(startDate)],
              ["Empfänger", recipientName],
              ["Dauer", `${durationMonths} ${durationMonths === 1 ? "Monat" : "Monate"}`],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "0.75rem 0",
                  borderBottom: i < arr.length - 1 ? `1px dashed ${BURGUNDY}` : "none",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: BURGUNDY,
                    opacity: 0.7,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontSize: "1.05rem",
                    color: BURGUNDY,
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: ORANGE,
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              So geht&apos;s weiter
            </p>

            {loadingMails ? (
              <p style={{ fontFamily: "var(--font-sans), sans-serif", color: BURGUNDY, opacity: 0.6 }}>
                Wird geladen …
              </p>
            ) : mailsError ? (
              <p style={{ fontFamily: "var(--font-sans), sans-serif", color: ORANGE }}>
                {mailsError}
              </p>
            ) : (
              <div>
                {mails.map((mail, i) => (
                  <div
                    key={mail.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "7rem 1fr 6rem",
                      gap: "0 1.25rem",
                      alignItems: "center",
                      padding: "0.9rem 0",
                      borderBottom:
                        i < mails.length - 1
                          ? `1px dashed rgba(120, 2, 40, 0.25)`
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-serif), serif",
                        fontSize: "0.95rem",
                        color: ORANGE,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {formatMonthYear(mail.send_date)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans), sans-serif",
                        fontSize: "0.95rem",
                        color: BURGUNDY,
                      }}
                    >
                      {mail.vouchers?.title ?? "—"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans), sans-serif",
                        fontSize: "0.8rem",
                        color: BURGUNDY,
                        opacity: 0.55,
                        textAlign: "right",
                      }}
                    >
                      {formatDate(mail.send_date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <a href={`/gift/${orderId}`} className="ll-btn">
              Empfänger-Seite ansehen →
            </a>
            <p
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "0.85rem",
                color: BURGUNDY,
                opacity: 0.55,
                marginTop: "1rem",
              }}
            >
              Eine Bestätigung wurde an deine E-Mail geschickt.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom envelope deco */}
      <section
        style={{
          padding: "clamp(2rem, 4vw, 3rem) 1.5rem clamp(2rem, 4vw, 3rem)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", opacity: 0.5 }}>
          <EnvelopeDoodle size={100} color={BURGUNDY} />
        </div>
      </section>
    </main>
  );
}
