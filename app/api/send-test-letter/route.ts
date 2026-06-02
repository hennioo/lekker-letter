import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import LekkerLetterEmail from "@/emails/LekkerLetterEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { scheduledMailId?: string };

    if (body.scheduledMailId) {
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

      if (!recipient || !voucher) {
        return NextResponse.json({ error: "Missing recipient or voucher data" }, { status: 400 });
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
      // TODO: use recipient.email once custom domain is verified
      const toAddress = "henningdeliusfritz@gmail.com";

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: "Lekker Letter <onboarding@resend.dev>",
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
          voucherValidUntil: voucher.valid_until,
        }),
      });

      if (resendError) {
        console.error('[send-test-letter] Resend error:', resendError)
        return NextResponse.json({ error: resendError.message }, { status: 500 })
      }

      console.log('[send-test-letter] Mail sent successfully:', resendData?.id)

      return NextResponse.json({ success: true });
    }

    // Fallback: hardcoded test
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Lekker Letter <onboarding@resend.dev>",
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
