"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  orderId: string;
  recipientName: string;
  giverName: string;
  durationMonths: number;
  startDate: string;
}

interface FetchError {
  message: string;
}

interface ScheduledMail {
  id: string;
  send_date: string;
  vouchers: { title: string } | null;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

export default function ConfirmationClient({ orderId, recipientName, giverName, durationMonths, startDate }: Props) {
  const [mails, setMails] = useState<ScheduledMail[]>([]);
  const [loadingMails, setLoadingMails] = useState(true);
  const [mailsError, setMailsError] = useState<FetchError | null>(null);

  useEffect(() => {
    async function fetchMails() {
      const { data, error } = await supabase
        .from("scheduled_mails")
        .select("id, send_date, vouchers(title)")
        .eq("order_id", orderId)
        .order("send_date", { ascending: true });

      if (error || !data) {
        setMailsError({ message: "Mails konnten nicht geladen werden" });
      } else {
        setMails(data as unknown as ScheduledMail[]);
      }
      setLoadingMails(false);
    }

    fetchMails();
  }, [orderId]);

  return (
    <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "#f5f0e8" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 2rem 6rem" }}>

        {/* Nav */}
        <nav style={{ padding: "2rem 0 0", marginBottom: "4rem" }}>
          <a href="/" style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "#f5f0e8",
            textDecoration: "none",
          }}>
            LEKKER LETTER
          </a>
        </nav>

        {/* 1. Success header */}
        <section style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1.25rem" }}>🎁</div>
          <h1 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "#f5f0e8",
            marginBottom: "0.75rem",
          }}>
            Dein Geschenk läuft!
          </h1>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "1rem",
            color: "#a09880",
            lineHeight: 1.6,
          }}>
            {durationMonths} {durationMonths === 1 ? "Monat" : "Monate"} für {recipientName} — los geht&apos;s.
          </p>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.9rem",
            color: "#4a4540",
            lineHeight: 1.6,
            marginTop: "0.5rem",
          }}>
            {giverName} hat alles vorbereitet.
          </p>
        </section>

        {/* 2. Summary box */}
        <section style={{
          border: "1px solid #2a2a2a",
          backgroundColor: "#141414",
          padding: "1.5rem",
          marginBottom: "3rem",
        }}>
          {[
            ["Erste Mail", formatDate(startDate)],
            ["Empfänger", recipientName],
            ["Dauer", `${durationMonths} ${durationMonths === 1 ? "Monat" : "Monate"}`],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "0.6rem 0",
              borderBottom: "1px solid #1e1e1e",
            }}>
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a09880",
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.95rem",
                color: "#f5f0e8",
              }}>
                {value}
              </span>
            </div>
          ))}
        </section>

        {/* 3. Timeline */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#a09880",
            marginBottom: "1rem",
          }}>
            Geplante Mails
          </p>

          {loadingMails ? (
            <p style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
              color: "#4a4540",
              padding: "1rem 0",
            }}>
              Wird geladen…
            </p>
          ) : mailsError ? (
            <p style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.9rem",
              color: "#4a4540",
              padding: "1rem 0",
            }}>
              {mailsError.message}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {mails.map((mail, i) => (
                <div key={mail.id} style={{
                  display: "grid",
                  gridTemplateColumns: "7rem 1fr 6rem",
                  gap: "0 1.25rem",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: i < mails.length - 1 ? "1px solid #1e1e1e" : "none",
                }}>
                  <span style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "0.9rem",
                    color: "#c8a96e",
                    textTransform: "capitalize",
                  }}>
                    {formatMonthYear(mail.send_date)}
                  </span>
                  <span style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.9rem",
                    color: "#f5f0e8",
                  }}>
                    {mail.vouchers?.title ?? "—"}
                  </span>
                  <span style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.8rem",
                    color: "#4a4540",
                    textAlign: "right",
                  }}>
                    {formatDate(mail.send_date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. CTA */}
        <section style={{ textAlign: "center" }}>
          <a href={`/gift/${orderId}`} style={{
            display: "inline-block",
            backgroundColor: "#c8a96e",
            color: "#0f0f0f",
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            padding: "0.75rem 2rem",
            textDecoration: "none",
            borderRadius: 0,
            marginBottom: "1.25rem",
          }}>
            Empfänger-Seite ansehen →
          </a>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.8rem",
            color: "#4a4540",
            margin: 0,
          }}>
            Eine Bestätigung wurde an deine E-Mail geschickt.
          </p>
        </section>

      </div>
    </div>
  );
}
