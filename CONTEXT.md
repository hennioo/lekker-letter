# Lekker Letter — Kontext für Claude

Diese Datei existiert damit Claude Code immer den vollen Projektkontext hat.
Bitte beim Start jeder neuen Sitzung lesen.

---

## Die Idee

Lekker Letter löst ein echtes Problem: Es ist schwer, ein wirklich persönliches Geschenk zu machen.

**Was es ist:** Eine personalisierte Gutschein-Mail-Serie.
- Der Schenkende gibt Infos zur beschenkten Person (Interessen, Anlass, Beziehung)
- Lekker Letter stellt passende Gutscheine zusammen
- Die beschenkte Person bekommt monatlich eine ästhetische, persönliche Mail mit einem kuratierten Gutschein

**Was es nicht ist:** Kein Newsletter, keine klassische Gutschein-App, kein Amazon-Gutschein.

**Der USP:** Kuration + Ästhetik + Zugänglichkeit.

**Startmarkt:** Köln. Erste echte Anwendung: Schwester bekommt es zum Geburtstag.

---

## Das Team

| Person | Rolle |
|--------|-------|
| Henning | Technik, Entwicklung |
| Susan | Design, Ästhetik, Restaurant- und Barauswahl |

---

## Datenbankmodell (Supabase / PostgreSQL)

### `recipients`
```sql
id uuid PRIMARY KEY
name text
email text
city text
interests text          -- kommasepariert, z.B. "Weinbar, Fine Dining"
relationship_to_giver text
tone text               -- z.B. "warm & persönlich"
photos_urls text[]
created_at timestamptz
```

### `orders`
```sql
id uuid PRIMARY KEY
giver_name text
giver_email text
recipient_id uuid REFERENCES recipients(id)
occasion text           -- z.B. "Geburtstag", "Freundschaft"
duration_months integer -- 1, 3 oder 6
start_date date
status text             -- "active", "completed", "cancelled"
created_at timestamptz
```

### `vouchers`
```sql
id uuid PRIMARY KEY
title text              -- z.B. "Zwei Drinks nach Wahl"
partner_name text       -- z.B. "Bar Schmitz"
city text
category text           -- z.B. "Bar", "Restaurant", "Weinbar"
description text
address text
image_url text
voucher_code text
valid_until date
active boolean
created_at timestamptz
```

### `scheduled_mails`
```sql
id uuid PRIMARY KEY
order_id uuid REFERENCES orders(id)
recipient_id uuid REFERENCES recipients(id)
voucher_id uuid REFERENCES vouchers(id)
send_date date
status mail_status      -- ENUM (siehe unten)
generated_subject text  -- redundant, auch in generated_text als JSON-Feld
generated_text text     -- JSON: { subject, intro, voucher_transition, closing }
template_key text
sent_at timestamptz
created_at timestamptz
```

**Mail-Status ENUM:**
```
draft → approved → sent
                 → failed
       → cancelled
```

---

## AI-Textgenerierung

Route: `/api/generate-letter-text`

**Input (aus Supabase geladen):**
- Empfänger: name, interests, city, tone, relationship_to_giver
- Gutschein: title, description, partner_name
- Bestellung: occasion

**Output (JSON, gespeichert in `generated_text`):**
```json
{
  "subject": "...",
  "intro": "...",
  "voucher_transition": "...",
  "closing": "..."
}
```

**Modell:** OpenAI gpt-4o-mini

---

## E-Mail-Template

`emails/LekkerLetterEmail.tsx` — React Email Komponente

Empfängt:
- `recipientName`, `giverName`
- `intro`, `voucherTransition`, `closing`
- `voucherTitle`, `voucherDescription`, `partnerName`, `partnerAddress`, `voucherCode`, `voucherValidUntil`

---

## Wichtige Architekturentscheidungen

**Warum alle Mails erstmal an den Admin gehen:**
MVP-Phase — alle Mails gehen zur Prüfung an henningdeliusfritz@gmail.com, nicht an den echten Empfänger. Das ist bewusst so. Erst wenn der Admin die Mail freigibt (approved), geht sie raus — und auch dann nur über den Cron Job.

**Warum kein Self-Service für Schenkende (noch):**
Verzögert den ersten echten Test. Der Test soll zeigen ob das Konzept funktioniert, bevor Payment und Kundendashboard gebaut werden.

**Warum Resend + React Email:**
Entwicklerfreundlich, gute Browser-Preview, passt gut zu Next.js.

**Supabase-Clients:**
- `supabase` (anon key) — für Client-Components (NEXT_PUBLIC_*)
- `supabaseAdmin` (service role) — für alle API-Routes, hat vollen DB-Zugriff

---

## Was bewusst NICHT gebaut wird (bis nach MVP)

- Payment-System
- Kundendashboard / Self-Service
- Partnerdashboard
- Nutzeraccounts / Auth
- QR-Code-Scanner
- Mehrere Städte
- Vollautomatisches AI-Matching ohne Review

---

## Bekannte Issues

1. **`generated_subject` Spalte ist redundant** — das Subject steht bereits als JSON-Feld in `generated_text`. Die Spalte wird in `send-test-letter` nicht verwendet.
2. **Datumsformat-Mismatch** — `valid_until` kommt aus Supabase im ISO-Format (2026-12-31), das Template-Default ist deutsches Format (31.12.2025). Muss noch normalisiert werden.
3. **`package.json` name** ist noch "lekker-letter-temp" — das `-temp` kann entfernt werden.
