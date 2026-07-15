import {
  ArrowDoodle,
  CandleDoodle,
  FoldLine,
  LL_COLORS,
  StarDoodle,
} from "./_components/doodles";
import RotatingWord from "./_components/RotatingWord";
import StickyCTA from "./_components/StickyCTA";

const { orange: ORANGE, burgundy: BURGUNDY, pink: PINK, yellow: YELLOW, paper: PAPER } = LL_COLORS;

const serif = "var(--font-serif), 'Times New Roman', Times, serif";
const sans = "var(--font-sans), system-ui, sans-serif";

const MONTHS_DE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const STEPS: Array<{
  num: string;
  text: string;
  bg: string;
  numColor: string;
  textColor: string;
}> = [
  {
    num: "01",
    text: "Du erzählst uns von der Person.",
    bg: ORANGE,
    numColor: YELLOW,
    textColor: BURGUNDY,
  },
  {
    num: "02",
    text: "Wir stellen passende Erlebnisse zusammen.",
    bg: BURGUNDY,
    numColor: YELLOW,
    textColor: ORANGE,
  },
  {
    num: "03",
    text: "Sie bekommt jeden Monat eine persönliche Überraschung.",
    bg: PINK,
    numColor: ORANGE,
    textColor: BURGUNDY,
  },
];

const PARTNERS = [
  "Bar Schmitz",
  "Café Reichard",
  "Freddy Schilling",
  "Weinlager",
  "Zum Scheuen Reh",
  "Metzger & Marie",
  "Ox & Klee",
  "Salon Schmitz",
  "Little Link",
  "Heinzelmännchen",
];

const POSTCARD_CONTENT: Array<{ title: string; partner: string; bg: string; accent: string }> = [
  {
    title: "Weinabend zu zweit",
    partner: "Bar Schmitz · Ehrenfeld",
    bg: PAPER,
    accent: ORANGE,
  },
  {
    title: "Frühstück ganz in Ruhe",
    partner: "Café Reichard · Altstadt",
    bg: PINK,
    accent: BURGUNDY,
  },
  {
    title: "Konzert im Stadtgarten",
    partner: "Live-Musik · Neustadt-Nord",
    bg: PAPER,
    accent: ORANGE,
  },
];

const TILTS = ["-2deg", "1.5deg", "-1deg"];

function upcomingMonths(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return MONTHS_DE[d.getMonth()];
  });
}

export default function Home() {
  const monthLabels = upcomingMonths(POSTCARD_CONTENT.length);

  return (
    <main style={{ background: PAPER, minHeight: "100vh" }}>
      {/* HERO — orange */}
      <section
        style={{
          background: ORANGE,
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top nav */}
        <div
          className="ll-nav"
          style={{
            fontFamily: sans,
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            color: YELLOW,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <span>Lekker Letter</span>
          <span>Köln → dich</span>
        </div>

        {/* Hero title */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "clamp(3rem, 10vw, 6rem) 0 clamp(2rem, 6vw, 4rem)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            className="ll-sway"
            style={{
              position: "absolute",
              top: "1rem",
              left: "6%",
              // @ts-expect-error CSS custom property
              "--ll-rot": "-14deg",
              transform: "rotate(-14deg)",
            }}
          >
            <StarDoodle size={72} color={YELLOW} />
          </div>
          <div
            className="ll-sway--reverse"
            style={{
              position: "absolute",
              top: "2rem",
              right: "5%",
              // @ts-expect-error CSS custom property
              "--ll-rot": "18deg",
              transform: "rotate(18deg)",
            }}
          >
            <StarDoodle size={54} color={BURGUNDY} />
          </div>

          <h1
            style={{
              fontFamily: serif,
              fontWeight: 700,
              color: BURGUNDY,
              fontSize: "clamp(2rem, 8.5vw, 6.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Das
            <br />
            persönlichste
            <br />
            Geschenk.
          </h1>

          <p
            style={{
              fontFamily: sans,
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              lineHeight: 1.5,
              color: BURGUNDY,
              maxWidth: "560px",
              margin: "clamp(2rem, 5vw, 3rem) auto 1.5rem",
              letterSpacing: "-0.01em",
              padding: "0 1rem",
            }}
          >
            Eine kuratierte Gutschein-Serie für die Menschen, die dir wichtig
            sind. Personalisiert, ästhetisch, jeden Monat neu.
          </p>

          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
              color: BURGUNDY,
              margin: "0 auto 2.5rem",
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            Für{" "}
            <RotatingWord
              words={[
                "Mama.",
                "deinen besten Freund.",
                "Papa.",
                "die eine Kollegin.",
                "dich selbst.",
              ]}
            />
          </p>

          <a href="/new" className="ll-btn">
            Jetzt verschenken →
          </a>
        </div>
      </section>

      {/* SPLIT block — burgundy + pink */}
      <section className="ll-split">
        {/* Left: burgundy with yellow headline */}
        <div
          className="ll-split-block"
          style={{
            background: BURGUNDY,
            padding: "clamp(2.5rem, 6vw, 5rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          <span
            style={{
              fontFamily: sans,
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              color: ORANGE,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Ein Jahr lang
          </span>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              color: YELLOW,
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Jeden Monat
            <br />
            ein kleines
            <br />
            Highlight.
          </h2>
          <p
            style={{
              fontFamily: sans,
              fontSize: "1rem",
              lineHeight: 1.55,
              color: ORANGE,
              maxWidth: "420px",
              marginTop: "0.5rem",
            }}
          >
            Kuratierte Gutscheine für die schönsten Orte deiner Stadt —
            handverlesen und persönlich verpackt in einer Mail, auf die man
            sich freut.
          </p>
        </div>

        {/* Right: dusty pink with quote & candle */}
        <div
          className="ll-split-block"
          style={{
            background: PINK,
            padding: "clamp(2.5rem, 6vw, 5rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "1.5rem",
            position: "relative",
          }}
        >
          <div
            className="ll-cherry-wrap ll-sway--reverse"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              // @ts-expect-error CSS custom property
              "--ll-rot": "-8deg",
              transform: "rotate(-8deg)",
            }}
          >
            <CandleDoodle size={80} />
          </div>
          <span
            style={{
              fontFamily: sans,
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              color: BURGUNDY,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Ehrlich gesagt
          </span>
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              lineHeight: 1.1,
              color: BURGUNDY,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Etwas, das{" "}
            <span style={{ fontWeight: 700, fontStyle: "normal" }}>
              wirklich&nbsp;passt.
            </span>
          </p>
        </div>
      </section>

      {/* PEEK INSIDE — postcard example */}
      <section
        style={{
          background: PAPER,
          padding: "clamp(3rem, 7vw, 5rem) 0 clamp(2rem, 4vw, 3rem)",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 1.5rem", marginBottom: "2.5rem" }}>
          <span
            style={{
              fontFamily: sans,
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              color: ORANGE,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Zum Beispiel
          </span>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
              color: BURGUNDY,
              letterSpacing: "-0.045em",
              textTransform: "uppercase",
              fontWeight: 700,
              lineHeight: 1,
              marginTop: "0.75rem",
            }}
          >
            Marta bekommt dieses Jahr …
          </h2>
        </div>

        <div className="ll-postcards">
          {POSTCARD_CONTENT.map((card, i) => (
            <article
              key={i}
              className="ll-postcard"
              style={{
                background: card.bg,
                // @ts-expect-error CSS custom property
                "--tilt": TILTS[i] ?? "0deg",
                borderColor: BURGUNDY,
                boxShadow: `4px 4px 0 ${BURGUNDY}`,
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: card.accent,
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                {monthLabels[i] ?? ""}
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: "1.5rem",
                  color: BURGUNDY,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: "0.85rem",
                  color: BURGUNDY,
                  opacity: 0.7,
                  letterSpacing: "0.02em",
                }}
              >
                {card.partner}
              </div>
            </article>
          ))}
        </div>

        <div style={{ padding: "3rem 1.5rem 0" }}>
          <FoldLine />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: PAPER }}>
        <div
          style={{
            padding:
              "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <ArrowDoodle color={ORANGE} size={38} />
          </div>
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              color: BURGUNDY,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              fontWeight: 700,
              lineHeight: 0.95,
            }}
          >
            So geht’s.
          </h2>
        </div>

        <div className="ll-steps">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`ll-step ll-reveal ll-reveal--delay-${i + 1}`}
              style={{
                background: step.bg,
                padding:
                  "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2.5rem, 5vw, 3.5rem)",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                minHeight: "clamp(240px, 22vw, 320px)",
              }}
            >
              <span
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(3rem, 6vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  color: step.numColor,
                  fontWeight: 700,
                }}
              >
                {step.num}
              </span>
              <span
                className="ll-step-text"
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(1.35rem, 2vw, 1.7rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: step.textColor,
                  fontWeight: 500,
                  marginTop: "auto",
                }}
              >
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER TICKER */}
      <section className="ll-ticker" aria-label="Unsere Partner">
        <div className="ll-ticker-track">
          {[...PARTNERS, ...PARTNERS].map((name, idx) => (
            <span
              key={`${name}-${idx}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "3rem" }}
            >
              <span className="ll-ticker-item">{name}</span>
              <span className="ll-ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* FINAL statement banner — burgundy, no CTA (sticky button covers that) */}
      <section
        style={{
          background: BURGUNDY,
          padding: "clamp(3rem, 8vw, 5rem) clamp(1.5rem, 4vw, 3rem)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: serif,
            color: ORANGE,
            fontSize: "clamp(2rem, 6vw, 4rem)",
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            lineHeight: 0.95,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Guten Hunger.
        </h2>
      </section>

      {/* FOOTER */}
      <footer
        className="ll-footer"
        style={{
          background: PAPER,
          padding: "1.5rem clamp(1.5rem, 4vw, 3rem)",
          fontFamily: sans,
          fontSize: "0.75rem",
          color: BURGUNDY,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 500,
          borderTop: "1px dashed rgba(120, 2, 40, 0.35)",
        }}
      >
        <span>© Lekker Letter, Köln 2026</span>
        <a href="/admin" style={{ color: BURGUNDY, opacity: 0.6 }}>
          Admin →
        </a>
      </footer>

      <StickyCTA threshold={700} />
    </main>
  );
}
