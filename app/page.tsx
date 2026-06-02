export default function Home() {
  return (
    <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "#f5f0e8" }}>

      {/* Nav */}
      <nav style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "2rem 2rem 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          color: "#f5f0e8",
        }}>
          LEKKER LETTER
        </span>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "6rem 2rem 5rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          color: "#c8a96e",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}>
          Köln · 2026
        </p>

        <h1 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "#f5f0e8",
          marginBottom: "1.75rem",
          letterSpacing: "-0.01em",
        }}>
          Das persönlichste Geschenk,<br />
          das du machen kannst.
        </h1>

        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "1rem",
          lineHeight: 1.7,
          color: "#a09880",
          maxWidth: "480px",
          margin: "0 auto 2.5rem",
        }}>
          Eine kuratierte Gutschein-Serie für die Menschen, die dir wichtig sind.
          Personalisiert, ästhetisch, jeden Monat neu.
        </p>

        <a href="/new" style={{
          display: "inline-block",
          backgroundColor: "#c8a96e",
          color: "#0f0f0f",
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          padding: "0.75rem 2rem",
          textDecoration: "none",
          borderRadius: 0,
        }}>
          Jetzt verschenken →
        </a>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 2rem" }}>
        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e" }} />
      </div>

      {/* How it works */}
      <section style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "4rem 2rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {[
            ["01", "Du erzählst uns von der Person"],
            ["02", "Wir stellen passende Erlebnisse zusammen"],
            ["03", "Sie bekommt jeden Monat eine persönliche Überraschung"],
          ].map(([num, text]) => (
            <div key={num} style={{ display: "flex", alignItems: "baseline", gap: "1.5rem" }}>
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                color: "#c8a96e",
                minWidth: "1.5rem",
                flexShrink: 0,
              }}>
                {num}
              </span>
              <span style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "1.1rem",
                fontWeight: 400,
                color: "#f5f0e8",
                lineHeight: 1.5,
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 2rem" }}>
        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e" }} />
      </div>

      {/* Closing */}
      <section style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "5rem 2rem 6rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "1.35rem",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#f5f0e8",
        }}>
          Kein Amazon-Gutschein. Kein Blumenstrauß.<br />
          Etwas, das wirklich zu ihr passt.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #1e1e1e",
      }}>
        <span style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.75rem",
          color: "#4a4540",
        }}>
          © Lekker Letter, Köln 2026
        </span>
        <a href="/admin" style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.75rem",
          color: "#4a4540",
          textDecoration: "none",
        }}>
          Admin →
        </a>
      </footer>

    </div>
  );
}
