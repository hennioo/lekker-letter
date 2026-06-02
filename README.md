# Lekker Letter

Eine personalisierte Geschenk-Mail-Serie für Kölner Restaurants und Bars.

Jemand verschenkt eine kuratierte Gutschein-Serie. Der Empfänger bekommt über mehrere Monate monatlich eine ästhetische, persönliche Mail mit einem Gutschein — passend ausgewählt nach Interessen, Anlass und Atmosphäre.

**Repo:** https://github.com/hennioo/lekker-letter  
**Live:** https://lekker-letter.vercel.app

---

## Tech Stack

| Bereich | Tool |
|---------|------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Datenbank | Supabase (PostgreSQL) |
| E-Mail-Templates | React Email |
| E-Mail-Versand | Resend |
| AI-Texte | OpenAI gpt-4o-mini |
| Deployment | Vercel (inkl. Cron Job) |

---

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen setzen

`.env.local` anlegen mit folgenden Werten:

```env
# Resend (E-Mail-Versand)
RESEND_API_KEY=re_...

# Supabase (öffentlich, für Client-Components)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase (geheim, nur server-seitig)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (AI-Textgenerierung)
OPENAI_API_KEY=sk-...

# Cron Job Authentifizierung (beliebiger String, muss in Vercel gesetzt sein)
CRON_SECRET=...
```

### 3. Supabase-Schema einspielen

Im Supabase SQL Editor `supabase/schema.sql` ausführen.

### 4. Lokale Entwicklung starten

```bash
npm run dev
```

---

## Der Order-Flow

```
1. Admin legt Bestellung an (/admin/orders/new)
   → Recipient + Order in Supabase gespeichert
   → scheduled_mails für alle Monate angelegt (status: draft)

2. AI-Textgenerierung (/api/generate-letter-text)
   → Lädt Mail-Daten aus Supabase
   → Ruft OpenAI auf (personalisierter Text für Empfänger + Gutschein)
   → Speichert generated_text + generated_subject zurück

3. Preview & Freigabe (/admin/scheduled-mails/[id]/preview)
   → Mail im Browser ansehen
   → Test-Mail senden
   → Freigeben (status: approved)

4. Automatischer Versand (täglich 07:00 Uhr via Cron)
   → Alle scheduled_mails mit status=approved und send_date <= heute
   → React Email Template rendern → Resend → status: sent
```

---

## Wichtige Routen

| Route | Beschreibung |
|-------|-------------|
| `/admin` | Admin-Dashboard |
| `/admin/orders` | Alle Bestellungen |
| `/admin/orders/new` | Neue Bestellung anlegen |
| `/admin/orders/[id]` | Bestelldetails + geplante Mails |
| `/admin/scheduled-mails/[id]/preview` | Mail-Vorschau, Approve, Test-Versand |
| `/api/generate-letter-text` | AI-Textgenerierung (POST) |
| `/api/send-test-letter` | Test-Mail senden (POST) |
| `/api/send-due-mails` | Cron: fällige Mails senden (GET) |
| `/api/trigger-due-mails` | Manueller Trigger für Cron-Logik |

---

## Bekannte Einschränkungen

- **Resend-Domain** noch nicht verifiziert — Mails werden von `onboarding@resend.dev` gesendet (Resend-Testmodus)
- **Empfänger-Adresse** ist in Test-Routen auf `henningdeliusfritz@gmail.com` hardcoded (bewusst für MVP-Phase, alle Mails gehen zur Prüfung an den Admin)
- **Admin-Routen** sind nicht passwortgeschützt

---

## Deployment (Vercel)

Der Cron Job ist in `vercel.json` konfiguriert und läuft täglich um 07:00 Uhr UTC.  
Alle Env-Variablen müssen in den Vercel Project Settings gesetzt sein.
