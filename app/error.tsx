"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      minHeight: "100vh",
      color: "#f5f0e8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      padding: "2rem",
    }}>
      <p style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "1.1rem",
        color: "#a09880",
        textAlign: "center",
      }}>
        Etwas ist schiefgelaufen.
      </p>
      <button
        onClick={reset}
        style={{
          backgroundColor: "#c8a96e",
          color: "#0f0f0f",
          border: "none",
          padding: "0.75rem 2rem",
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.9rem",
          cursor: "pointer",
          borderRadius: 0,
        }}
      >
        Nochmal versuchen
      </button>
    </div>
  );
}
