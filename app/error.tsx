"use client";

import { LL_COLORS, WaxSealDoodle } from "./_components/doodles";

const { burgundy: BURGUNDY, paper: PAPER } = LL_COLORS;

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      style={{
        background: PAPER,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.75rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ opacity: 0.85 }}>
        <WaxSealDoodle size={80} />
      </div>
      <h1
        className="ll-h2"
        style={{ margin: 0, color: BURGUNDY, maxWidth: 400 }}
      >
        Etwas ist schiefgelaufen.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans), sans-serif",
          color: BURGUNDY,
          opacity: 0.7,
          maxWidth: 380,
          lineHeight: 1.6,
        }}
      >
        Kein Grund zur Sorge — probier&apos;s einfach nochmal.
      </p>
      <button onClick={reset} className="ll-btn">
        Nochmal versuchen
      </button>
    </main>
  );
}
