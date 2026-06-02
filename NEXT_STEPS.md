# Lekker Letter — Next Steps

Zuletzt aktualisiert: Juni 2026

---

## Status

Die Admin-Pipeline steht komplett:
- Bestellung anlegen → AI-Text generieren → Preview → Approve → Cron-Versand
- Bekannter Bug: "Send Test Mail" Button möglicherweise kaputt (Route lädt evtl. nicht die richtigen Daten)

Was fehlt: die Kunden-Seiten (Startseite, Bestellformular, Bestätigungsseite, Empfänger-Seite).

---

## Priorität 1 — Aufräumen (bevor Susan etwas sieht)

### 1.1 Send Test Mail Bug fixen
**Datei:** `app/api/send-test-letter/route.ts`

Verdacht: Route fällt auf Fallback zurück (ohne scheduledMailId) oder schluckt Fehler still.

Debugging-Schritte:
- Logge den eingehenden `scheduledMailId` am Anfang der Route
- Logge ob der Supabase-Query Daten zurückgibt
- Logge ob `resend.emails.send()` aufgerufen wird
- Prüfe ob der Button in PreviewActions.tsx den richtigen Body sendet

### 1.2 README ersetzen
**Datei:** `README.md`

Die aktuelle README ist Next.js-Boilerplate. Ersetzen durch `/home/claude/README.md` aus diesem Repo (bereits fertig, siehe Handover).

### 1.3 CONTEXT.md und NEXT_STEPS.md ins Repo
Diese beiden Dateien ins Repo-Root kopieren damit Claude Code sie lesen kann.

---

## Priorität 2 — Susan-Version (Kunden-Flow)

Reihenfolge wichtig — jede Seite baut auf der vorherigen auf.

### 2.1 Dummy-Gutscheine eintragen (Supabase SQL Editor)
```sql
INSERT INTO vouchers (title, partner_name, city, category, description, address, voucher_code, valid_until, active)
VALUES
  ('Zwei Drinks nach Wahl', 'Bar Schmitz', 'Köln', 'Bar', 'Zwei Drinks eurer Wahl an der Bar', 'Aachener Str. 28, 50674 Köln', 'LEKKER-SCHMITZ-001', '2026-12-31', true),
  ('Dinner für zwei', 'Restaurant Alfredo', 'Köln', 'Restaurant', 'Ein 3-Gänge-Dinner für zwei Personen', 'Habsburgerring 1, 50674 Köln', 'LEKKER-ALFREDO-001', '2026-12-31', true),
  ('Weinverkostung für zwei', 'Weinbar Vino', 'Köln', 'Weinbar', 'Eine geführte Weinverkostung mit 5 Weinen für zwei', 'Friesenstr. 14, 50670 Köln', 'LEKKER-VINO-001', '2026-12-31', true),
  ('Brunch für zwei', 'Café Central', 'Köln', 'Café', 'Ausgiebiger Sonntagsbrunch für zwei Personen', 'Appellhofplatz 3, 50667 Köln', 'LEKKER-CENTRAL-001', '2026-12-31', true),
  ('Cocktail-Abend für zwei', 'Spirits Bar', 'Köln', 'Bar', 'Zwei Signature Cocktails plus Snacks für zwei', 'Zülpicher Str. 22, 50674 Köln', 'LEKKER-SPIRITS-001', '2026-12-31', true);
```

### 2.2 Startseite (`app/page.tsx`)
Aktuell: Test-E-Mail-Formular (Dev-Tool, nicht für Susan).
Ersetzen durch echte Landingpage.

Design: #0f0f0f Hintergrund, #f5f0e8 Text, #c8a96e Gold-Akzent, Serif-Headings, max-width 640px.

Sektionen:
- Hero mit Headline "Das persönlichste Geschenk, das du machen kannst."
- 3 Schritte (wie es funktioniert)
- CTA Button → /new
- Footer mit kleinem "Admin →" Link zu /admin

### 2.3 Bestellformular (`app/new/page.tsx`)
Kundenseitiges Formular (ersetzt Admin-Formular für Endkunden).

Felder: Dein Name, Name der Person, E-Mail, Anlass (4 Optionen als Cards), Interessen (6 Chips, Multi-Select), Dauer (1/3/6 Monate), Startdatum.

Submit → POST /api/create-order → redirect zu /confirmation/[orderId]

### 2.4 Create-Order API Route (`app/api/create-order/route.ts`)
Neue Route die den kompletten Kunden-Flow in einem Request abhandelt:
1. Recipient in Supabase anlegen
2. Order anlegen
3. Alle aktiven Vouchers laden
4. scheduled_mails anlegen (Round-Robin über Vouchers)
5. Bestätigungs-Mail an Admin senden (Resend)
6. orderId zurückgeben

### 2.5 Bestätigungsseite (`app/confirmation/[orderId]/page.tsx`)
Nach erfolgreicher Bestellung.

Zeigt: Zusammenfassung, Timeline der geplanten Mails, Link zur Empfänger-Seite.
Optional: AI-Generierungs-Status (polling bis alle Mails nicht mehr "draft" sind).

### 2.6 Empfänger-Seite (`app/gift/[orderId]/page.tsx`)
Seite für die beschenkte Person.

Zeigt: Persönliche Begrüßung, Anlass-Badge, Timeline aller geplanten Mails.
- Vergangene/fällige Mails: offene Karte mit Gutschein-Details
- Zukünftige Mails: gesperrte Karte mit Countdown

### 2.7 AI-Generierung im Hintergrund (`app/api/generate-all-texts/[orderId]/route.ts`)
Wird client-seitig von der Bestätigungsseite aufgerufen.
Generiert AI-Texte für alle draft-Mails einer Order sequenziell.

---

## Priorität 3 — Später (nach erstem Susan-Test)

- [ ] Datumsformat normalisieren (`valid_until` aus DB → deutsches Format)
- [ ] `generated_subject` Spalte aufräumen (redundant)
- [ ] `package.json` name von "lekker-letter-temp" auf "lekker-letter"
- [ ] Resend-Domain verifizieren (eigene Domain statt onboarding@resend.dev)
- [ ] Cron Job: Empfänger-Adresse nicht mehr hardcoden wenn Mails wirklich rausgehen sollen
- [ ] Auth-Schutz für Admin-Routen

---

## Nicht vor dem Schwester-Test

- Payment
- Partnerdashboard  
- QR-Codes
- Mehrere Städte
- Nutzeraccounts
