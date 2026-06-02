"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const OCCASIONS = [
  { value: "Geburtstag", label: "🎂 Geburtstag" },
  { value: "Freundschaft", label: "🤝 Freundschaft" },
  { value: "Danke", label: "🙏 Danke" },
  { value: "Einfach so", label: "✨ Einfach so" },
];

const INTEREST_OPTIONS = [
  "Weinbar",
  "Fine Dining",
  "Cocktails",
  "Kaffee & Frühstück",
  "Kunst & Kultur",
  "Live-Musik",
];

const DURATIONS = [
  { value: 1, label: "1 Monat" },
  { value: 3, label: "3 Monate" },
  { value: 6, label: "6 Monate" },
];

const today = new Date().toISOString().split("T")[0];

const s = {
  page: {
    backgroundColor: "#0f0f0f",
    minHeight: "100vh",
    color: "#f5f0e8",
  } as React.CSSProperties,
  inner: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 2rem 6rem",
  } as React.CSSProperties,
  nav: {
    padding: "2rem 0 0",
    marginBottom: "3.5rem",
  } as React.CSSProperties,
  navLink: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    color: "#f5f0e8",
    textDecoration: "none",
  } as React.CSSProperties,
  heading: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(1.6rem, 5vw, 2.25rem)",
    fontWeight: 400,
    lineHeight: 1.25,
    color: "#f5f0e8",
    marginBottom: "0.75rem",
  } as React.CSSProperties,
  subline: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.95rem",
    color: "#a09880",
    lineHeight: 1.6,
    marginBottom: "3rem",
  } as React.CSSProperties,
  fieldset: {
    marginBottom: "2.25rem",
    border: "none",
    padding: 0,
  } as React.CSSProperties,
  label: {
    display: "block",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#a09880",
    marginBottom: "0.6rem",
  } as React.CSSProperties,
  input: (invalid: boolean): React.CSSProperties => ({
    width: "100%",
    backgroundColor: "#141414",
    color: "#f5f0e8",
    border: `1px solid ${invalid ? "#8b2020" : "#2a2a2a"}`,
    padding: "0.75rem 1rem",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    borderRadius: 0,
    boxSizing: "border-box",
  }),
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.6rem",
  } as React.CSSProperties,
  card: (selected: boolean, invalid: boolean): React.CSSProperties => ({
    padding: "0.85rem 1rem",
    minHeight: "44px",
    backgroundColor: selected ? "rgba(200,169,110,0.08)" : "#141414",
    border: `1px solid ${invalid ? "#8b2020" : selected ? "#c8a96e" : "#2a2a2a"}`,
    color: selected ? "#c8a96e" : "#f5f0e8",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: 0,
    transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
  }),
  chipRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  } as React.CSSProperties,
  chip: (selected: boolean, invalid: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: selected ? "rgba(200,169,110,0.08)" : "#141414",
    border: `1px solid ${invalid ? "#8b2020" : selected ? "#c8a96e" : "#2a2a2a"}`,
    color: selected ? "#c8a96e" : "#f5f0e8",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: 0,
    transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
  }),
  durationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.6rem",
  } as React.CSSProperties,
  durationCard: (selected: boolean, invalid: boolean): React.CSSProperties => ({
    padding: "1.25rem 1rem",
    backgroundColor: selected ? "rgba(200,169,110,0.08)" : "#141414",
    border: `1px solid ${invalid ? "#8b2020" : selected ? "#c8a96e" : "#2a2a2a"}`,
    color: selected ? "#c8a96e" : "#f5f0e8",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "1.05rem",
    cursor: "pointer",
    textAlign: "center" as const,
    borderRadius: 0,
    transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
  }),
  submitButton: (loading: boolean): React.CSSProperties => ({
    backgroundColor: "#c8a96e",
    color: "#0f0f0f",
    border: "none",
    padding: "0.85rem 2rem",
    width: "100%",
    minHeight: "44px",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.04em",
    cursor: loading ? "default" : "pointer",
    borderRadius: 0,
    opacity: loading ? 0.75 : 1,
    transition: "opacity 0.15s",
  }),
  errorText: {
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.8rem",
    color: "#c0392b",
    marginTop: "1rem",
  } as React.CSSProperties,
};

type Fields = {
  giverName: boolean;
  giverEmail: boolean;
  recipientName: boolean;
  recipientEmail: boolean;
  occasion: boolean;
  interests: boolean;
  durationMonths: boolean;
  startDate: boolean;
};

export default function NewOrderPage() {
  const router = useRouter();

  const [giverName, setGiverName] = useState("");
  const [giverEmail, setGiverEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [durationMonths, setDurationMonths] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");

  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<Fields>({
    giverName: false,
    giverEmail: false,
    recipientName: false,
    recipientEmail: false,
    occasion: false,
    interests: false,
    durationMonths: false,
    startDate: false,
  });

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  function validate(): boolean {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const todayStr = new Date().toISOString().split("T")[0];
    const next: Fields = {
      giverName: !giverName.trim(),
      giverEmail: !emailRe.test(giverEmail.trim()),
      recipientName: !recipientName.trim(),
      recipientEmail: !emailRe.test(recipientEmail.trim()),
      occasion: !occasion,
      interests: interests.length === 0,
      durationMonths: durationMonths === null,
      startDate: !startDate || startDate < todayStr,
    };
    setInvalid(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    if (!validate()) return;

    submitting.current = true;
    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giverName: giverName.trim(),
          giverEmail: giverEmail.trim(),
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          occasion,
          interests,
          durationMonths,
          startDate,
          tone: "warm & persönlich",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "Unbekannter Fehler");
      }

      router.push(`/confirmation/${data.orderId}`);
    } catch (err) {
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Die Anfrage hat zu lange gedauert. Bitte versuche es nochmal."
          : err instanceof Error
          ? err.message
          : "Etwas ist schiefgelaufen. Bitte versuche es nochmal.";
      setError(message);
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* Nav */}
        <nav style={s.nav}>
          <a href="/" style={s.navLink}>LEKKER LETTER</a>
        </nav>

        {/* Header */}
        <h1 style={s.heading}>Wem schenkst du Lekker Letter?</h1>
        <p style={s.subline}>
          Erzähl uns von der Person — wir kümmern uns um den Rest.
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* 1. Giver name */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Dein Name</label>
            <input
              type="text"
              placeholder="Henning"
              value={giverName}
              onChange={(e) => setGiverName(e.target.value)}
              style={s.input(invalid.giverName)}
            />
          </fieldset>

          {/* 2. Giver email */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Deine E-Mail-Adresse</label>
            <input
              type="email"
              placeholder="henning@example.com"
              value={giverEmail}
              onChange={(e) => setGiverEmail(e.target.value)}
              style={s.input(invalid.giverEmail)}
            />
          </fieldset>

          {/* 3. Recipient name */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Name der beschenkten Person</label>
            <input
              type="text"
              placeholder="Marina"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              style={s.input(invalid.recipientName)}
            />
          </fieldset>

          {/* 3. Recipient email */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Ihre E-Mail-Adresse</label>
            <input
              type="email"
              placeholder="marina@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              style={s.input(invalid.recipientEmail)}
            />
          </fieldset>

          {/* 4. Occasion */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Was ist der Anlass?</label>
            <div style={s.cardGrid}>
              {OCCASIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOccasion(value)}
                  style={s.card(occasion === value, invalid.occasion)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 5. Interests */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Was mag sie?</label>
            <div style={s.chipRow}>
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={s.chip(interests.includes(interest), invalid.interests && interests.length === 0)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 6. Duration */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Wie viele Monate?</label>
            <div style={s.durationGrid}>
              {DURATIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDurationMonths(value)}
                  style={s.durationCard(durationMonths === value, invalid.durationMonths)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 7. Start date */}
          <fieldset style={s.fieldset}>
            <label style={s.label}>Wann soll die erste Mail ankommen?</label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={s.input(invalid.startDate)}
            />
          </fieldset>

          {/* Submit */}
          <button type="submit" disabled={loading} style={s.submitButton(loading)}>
            {loading ? "Wird eingerichtet…" : "Geschenk einrichten →"}
          </button>

          {error && <p style={s.errorText}>{error}</p>}

        </form>
      </div>
    </div>
  );
}
