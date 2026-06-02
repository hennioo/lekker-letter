import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface GeneratedEmailText {
  subject: string
  intro: string
  voucher_transition: string
  closing: string
}

interface GenerateEmailTextInput {
  recipientName: string
  occasion: string
  interests: string | null
  relationshipToGiver: string | null
  city: string | null
  voucherTitle: string
  voucherDescription: string
  tone: string | null
}

export async function generateEmailText(input: GenerateEmailTextInput): Promise<GeneratedEmailText> {
  const userPrompt = `Schreibe eine personalisierte Geschenk-Mail mit diesen Infos:
Empfänger: ${input.recipientName}
Anlass: ${input.occasion}
Interessen: ${input.interests ?? 'keine Angabe'}
Beziehung zum Schenkenden: ${input.relationshipToGiver ?? 'keine Angabe'}
Stadt: ${input.city ?? 'keine Angabe'}
Gutschein: ${input.voucherTitle} – ${input.voucherDescription}
Ton: ${input.tone ?? 'warm und persönlich'}

Antworte NUR mit einem JSON-Objekt in diesem Format (kein Markdown, kein Text davor oder danach):
{
  "subject": "Betreffzeile",
  "intro": "Persönliche Einleitung (2-3 Sätze)",
  "voucher_transition": "Überleitung zum Gutschein (1 Satz)",
  "closing": "Abschluss (1-2 Sätze)"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Du bist Texter für einen ästhetischen Geschenk-E-Mail-Service namens Lekker Letter. Du schreibst persönliche, warme, nicht kitschige Mails auf Deutsch. Kurz und prägnant.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
  })

  const raw = response.choices[0].message.content
  if (!raw) throw new Error('OpenAI returned empty response')

  // Strip markdown code fences if OpenAI wraps the JSON (e.g. ```json ... ```)
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const parsed = JSON.parse(cleaned) as GeneratedEmailText

  if (!parsed.subject || !parsed.intro || !parsed.voucher_transition || !parsed.closing) {
    throw new Error('OpenAI response missing required fields')
  }

  return parsed
}
