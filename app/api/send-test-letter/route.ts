import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import LekkerLetterEmail from "@/emails/LekkerLetterEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { scheduledMailId?: string };
    console.log('[send-test-letter] Received body:', body);

    if (body.scheduledMailId) {
      console.log('[send-test-letter] Path: scheduledMailId branch, id =', body.scheduledMailId);
      const { data: mail, error } = await supabaseAdmin
        .from("scheduled_mails")
        .select(`
          id,
          generated_text,
          recipients (name, email),
          vouchers (title, partner_name, city, address, voucher_code, valid_until)
        `)
        .eq("id", body.scheduledMailId)
        .single();

      console.log('[send-test-letter] Supabase query result — error:', error, '| mail:', JSON.stringify(mail));

      if (error || !mail) {
        return NextResponse.json({ error: "Scheduled mail not found" }, { status: 404 });
      }

      const recipient = mail.recipients as unknown as { name: string; email: string } | null;
      const voucher = mail.vouchers as unknown as {
        title: string;
        partner_name: string;
        city: string;
        address: string;
        voucher_code: string;
        valid_until: string;
      } | null;

      console.log('[send-test-letter] recipient:', recipient, '| voucher:', voucher);

      if (!recipient || !voucher) {
        console.log('[send-test-letter] Aborting: missing recipient or voucher');
        return NextResponse.json({ error: "Missing recipient or voucher data" }, { status: 400 });
      }

      let generated: { subject: string; intro: string; voucher_transition: string; closing: string } | null = null;
      if (mail.generated_text) {
        try {
          generated = JSON.parse(mail.generated_text as string);
          console.log('[send-test-letter] Parsed generated_text OK:', generated);
        } catch (parseErr) {
          console.warn('[send-test-letter] JSON.parse of generated_text failed:', parseErr);
          // fall through to defaults
        }
      } else {
        console.warn('[send-test-letter] generated_text is null/empty — will use defaults');
      }

      const emailSubject = generated?.subject ?? "🎁 Dein Lekker Letter";
      const toAddress = process.env.TEST_MAIL_TO ?? 'henningdeliusfritz@gmail.com';
      console.log('[send-test-letter] Sending test mail — to:', toAddress, '(real recipient:', recipient.email, ') | subject:', emailSubject);

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: "Lekker Letter <noreply@lekker-letter.de>",
        to: toAddress,
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
        console.error('[send-test-letter] Resend error:', resendError)
        return NextResponse.json({ error: resendError.message }, { status: 500 })
      }

      console.log('[send-test-letter] Mail sent successfully:', resendData?.id)

      return NextResponse.json({ success: true });
    }

    // Fallback: hardcoded test (no scheduledMailId in body)
    console.log('[send-test-letter] Path: fallback (no scheduledMailId) — sending generic test mail');
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Lekker Letter <noreply@lekker-letter.de>",
      to: "henningdeliusfritz@gmail.com",
      subject: "🎁 Dein erstes Lekker Letter",
      react: LekkerLetterEmail({}),
    });

    if (resendError) {
      console.error('[send-test-letter] Resend error:', resendError)
      return NextResponse.json({ error: resendError.message }, { status: 500 })
    }

    console.log('[send-test-letter] Mail sent successfully:', resendData?.id)

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
