"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function sendTestMail() {
    setStatus("sending");
    try {
      const res = await fetch("/api/send-test-letter", { method: "POST" });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "24px",
        fontFamily: "Georgia, serif",
        backgroundColor: "#f5f5f0",
      }}
    >
      <h1 style={{ fontSize: "28px", letterSpacing: "3px", fontWeight: 400 }}>
        LEKKER LETTER
      </h1>

      <button
        onClick={sendTestMail}
        disabled={status === "sending" || status === "sent"}
        style={{
          backgroundColor: status === "sent" ? "#4a7c59" : "#1a1a1a",
          color: "#ffffff",
          border: "none",
          padding: "14px 28px",
          fontSize: "15px",
          letterSpacing: "1px",
          borderRadius: "3px",
          cursor:
            status === "sending" || status === "sent" ? "default" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {status === "sending" ? "Wird verschickt…" : "Send Test Mail"}
      </button>

      {status === "sent" && (
        <p style={{ color: "#4a7c59", fontSize: "16px", margin: 0 }}>
          Mail verschickt!
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "16px", margin: 0 }}>
          Etwas ist schiefgelaufen. Bitte nochmal versuchen.
        </p>
      )}
    </main>
  );
}
