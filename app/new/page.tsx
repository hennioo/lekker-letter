"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LL_COLORS, StarDoodle } from "../_components/doodles";
import DatePicker from "../_components/DatePicker";

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW, paper: PAPER } = LL_COLORS;

const OCCASIONS = [
  { value: "Geburtstag", label: "Geburtstag" },
  { value: "Freundschaft", label: "Freundschaft" },
  { value: "Danke", label: "Danke" },
  { value: "Einfach so", label: "Einfach so" },
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

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function localIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return localIso(d);
}
function todayIso() {
  return localIso(new Date());
}

export default function NewOrderPage() {
  const router = useRouter();

  const [giverName, setGiverName] = useState("");
  const [giverEmail, setGiverEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [durationMonths, setDurationMonths] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(() => tomorrowIso());

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
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function validate(): boolean {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = todayIso();
    const next: Fields = {
      giverName: !giverName.trim(),
      giverEmail: !emailRe.test(giverEmail.trim()),
      recipientName: !recipientName.trim(),
      recipientEmail: !emailRe.test(recipientEmail.trim()),
      occasion: !occasion,
      interests: interests.length === 0,
      durationMonths: durationMonths === null,
      startDate: !startDate || startDate < today,
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
    <main style={{ background: PAPER, minHeight: "100vh" }}>
      {/* Hero-lite */}
      <section
        style={{
          background: ORANGE,
          padding:
            "clamp(1.25rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem) clamp(2.5rem, 6vw, 4rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <nav
          className="ll-nav"
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            color: YELLOW,
            fontWeight: 600,
            textTransform: "uppercase",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          <a href="/">← Lekker Letter</a>
          <span>Neuer Brief</span>
        </nav>

        <div
          style={{
            maxWidth: 640,
            margin: "clamp(2rem, 5vw, 3.5rem) auto 0",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            className="ll-sway"
            style={{
              position: "absolute",
              top: "-1rem",
              left: "-1rem",
              // @ts-expect-error CSS custom property
              "--ll-rot": "-10deg",
              transform: "rotate(-10deg)",
            }}
          >
            <StarDoodle size={54} color={YELLOW} />
          </div>
          <div
            className="ll-sway--reverse"
            style={{
              position: "absolute",
              top: "-1rem",
              right: "-1rem",
              // @ts-expect-error CSS custom property
              "--ll-rot": "12deg",
              transform: "rotate(12deg)",
            }}
          >
            <StarDoodle size={42} color={BURGUNDY} />
          </div>

          <h1 className="ll-h1" style={{ margin: 0 }}>
            Wem schenkst du
            <br />
            Lekker Letter?
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "1rem",
              color: BURGUNDY,
              lineHeight: 1.6,
              margin: "1.25rem auto 0",
              maxWidth: 460,
            }}
          >
            Erzähl uns von der Person — wir kümmern uns um den Rest.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "clamp(2.5rem, 5vw, 4rem) 1.5rem 5rem" }}>
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ maxWidth: 620, margin: "0 auto" }}
        >
          <fieldset className="ll-fieldset">
            <label className="ll-label">Dein Name</label>
            <input
              type="text"
              value={giverName}
              onChange={(e) => setGiverName(e.target.value)}
              className={`ll-input${invalid.giverName ? " ll-input--invalid" : ""}`}
            />
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Deine E-Mail-Adresse</label>
            <input
              type="email"
              value={giverEmail}
              onChange={(e) => setGiverEmail(e.target.value)}
              className={`ll-input${invalid.giverEmail ? " ll-input--invalid" : ""}`}
            />
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Name der beschenkten Person</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={`ll-input${invalid.recipientName ? " ll-input--invalid" : ""}`}
            />
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Ihre E-Mail-Adresse</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className={`ll-input${invalid.recipientEmail ? " ll-input--invalid" : ""}`}
            />
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Was ist der Anlass?</label>
            <div className="ll-card-grid">
              {OCCASIONS.map(({ value, label }) => {
                const selected = occasion === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOccasion(value)}
                    className={`ll-card${selected ? " ll-card--selected" : ""}${
                      invalid.occasion ? " ll-card--invalid" : ""
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Was mag sie?</label>
            <div className="ll-chip-row">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`ll-chip${selected ? " ll-chip--selected" : ""}${
                      invalid.interests && interests.length === 0 ? " ll-chip--invalid" : ""
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Wie viele Monate?</label>
            <div className="ll-duration-grid">
              {DURATIONS.map(({ value, label }) => {
                const selected = durationMonths === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDurationMonths(value)}
                    className={`ll-card${selected ? " ll-card--selected" : ""}${
                      invalid.durationMonths ? " ll-card--invalid" : ""
                    }`}
                    style={{ textAlign: "center" }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="ll-fieldset">
            <label className="ll-label">Wann soll die erste Mail ankommen?</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              min={tomorrowIso()}
              invalid={invalid.startDate}
            />
          </fieldset>

          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <button
              type="submit"
              disabled={loading}
              className="ll-btn"
              style={{ width: "100%", maxWidth: 360 }}
            >
              {loading ? "Wird eingerichtet …" : "Geschenk einrichten →"}
            </button>
            {error && (
              <p className="ll-error" style={{ marginTop: "1rem" }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
