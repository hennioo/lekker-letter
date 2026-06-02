import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import LekkerLetterEmail from "@/emails/LekkerLetterEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

// Vercel Cron Jobs send GET; the manual trigger proxy sends POST — both are handled here.
async function handler(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: dueMails, error: queryError } = await supabaseAdmin
    .from("scheduled_mails")
    .select(`
      id,
      generated_text,
      recipients (name, email),
      vouchers (title, partner_name, city, address, voucher_code, valid_until)
    `)
    .eq("status", "approved")
    .lte("send_date", today);

  if (queryError) {
    console.error("[send-due-mails] Query error:", queryError);
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const mail of dueMails ?? []) {
    const recipient = mail.recipients as unknown as { name: string; email: string } | null;
    const voucher = mail.vouchers as unknown as {
      title: string;
      partner_name: string;
      city: string;
      address: string;
      voucher_code: string;
      valid_until: string;
    } | null;

    if (!recipient || !voucher) {
      console.error(`[send-due-mails] Mail ${mail.id} missing recipient or voucher — skipping`);
      await supabaseAdmin
        .from("scheduled_mails")
        .update({ status: "failed" })
        .eq("id", mail.id);
      failed++;
      continue;
    }

    let generated: { subject: string; intro: string; voucher_transition: string; closing: string } | null = null;
    if (mail.generated_text) {
      try {
        generated = JSON.parse(mail.generated_text as string);
      } catch {
        // fall through to defaults
      }
    }

    const emailSubject = generated?.subject ?? "🎁 Dein Lekker Letter";

    try {
      const { error: resendError } = await resend.emails.send({
        from: "Lekker Letter <noreply@lekker-letter.de>",
        to: recipient.email,
        subject: emailSubject,
        react: LekkerLetterEmail({
          recipientName: recipient.name,
          subject: emailSubject,
          intro: generated?.intro,
          voucherTransition: generated?.voucher_transition,
          closing: generated?.closing,
          voucherTitle: voucher.title,
          voucherPartner: `${voucher.partner_name}, ${voucher.city}`,
          voucherAddress: voucher.address,
          voucherCode: voucher.voucher_code,
          voucherValidUntil: formatDateDE(voucher.valid_until),
        }),
      });

      if (resendError) {
        throw new Error(resendError.message);
      }

      const { error: updateError } = await supabaseAdmin
        .from("scheduled_mails")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", mail.id);

      if (updateError) {
        console.error(`[send-due-mails] Mail ${mail.id} sent but status update failed:`, updateError.message);
        failed++;
      } else {
        console.log(`[send-due-mails] Sent mail ${mail.id} to ${recipient.email}`);
        sent++;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[send-due-mails] Failed to send mail ${mail.id}:`, message);
      await supabaseAdmin
        .from("scheduled_mails")
        .update({ status: "failed" })
        .eq("id", mail.id);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed, skipped });
}

export const GET = handler;
export const POST = handler;
