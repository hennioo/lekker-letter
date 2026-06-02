import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      giverName: string;
      giverEmail: string;
      recipientName: string;
      recipientEmail: string;
      occasion: string;
      interests: string[];
      durationMonths: number;
      startDate: string;
      tone: string;
    };

    const { giverName, giverEmail, recipientName, recipientEmail, occasion, interests, durationMonths, startDate, tone } = body;

    // Validate before touching the DB
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const todayStr = new Date().toISOString().split("T")[0];

    if (!giverName?.trim() || !recipientName?.trim()) {
      return NextResponse.json({ error: "Missing required name fields" }, { status: 400 });
    }
    if (!emailRe.test(giverEmail) || !emailRe.test(recipientEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (![1, 3, 6].includes(durationMonths)) {
      return NextResponse.json({ error: "durationMonths must be 1, 3, or 6" }, { status: 400 });
    }
    if (!startDate || startDate < todayStr) {
      return NextResponse.json({ error: "startDate must be today or in the future" }, { status: 400 });
    }

    // 1. Insert recipient
    const { data: recipientData, error: recipientError } = await supabaseAdmin
      .from("recipients")
      .insert({
        name: recipientName,
        email: recipientEmail,
        city: "Köln",
        interests: interests.join(", "),
        relationship_to_giver: "Freund:in",
        tone,
      })
      .select("id")
      .single();

    if (recipientError || !recipientData) {
      console.error("[create-order] Failed to insert recipient:", recipientError);
      return NextResponse.json({ error: recipientError?.message ?? "Failed to insert recipient" }, { status: 500 });
    }

    const recipientId = recipientData.id as string;

    // 2. Insert order
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        giver_name: giverName,
        giver_email: giverEmail,
        recipient_id: recipientId,
        occasion,
        duration_months: durationMonths,
        start_date: startDate,
        status: "active",
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      console.error("[create-order] Failed to insert order:", orderError);
      return NextResponse.json({ error: orderError?.message ?? "Failed to insert order" }, { status: 500 });
    }

    const orderId = orderData.id as string;

    // 3. Load active vouchers
    const { data: vouchers, error: vouchersError } = await supabaseAdmin
      .from("vouchers")
      .select("id, title")
      .eq("active", true);

    if (vouchersError || !vouchers || vouchers.length === 0) {
      console.error("[create-order] Failed to load vouchers:", vouchersError);
      return NextResponse.json({ error: vouchersError?.message ?? "No active vouchers found" }, { status: 500 });
    }

    // 4. Create scheduled_mails — one per month
    const start = new Date(startDate);
    const scheduledMails = Array.from({ length: durationMonths }, (_, monthIndex) => {
      const sendDate = new Date(start);
      sendDate.setMonth(sendDate.getMonth() + monthIndex);

      return {
        order_id: orderId,
        recipient_id: recipientId,
        voucher_id: vouchers[monthIndex % vouchers.length].id,
        send_date: sendDate.toISOString().split("T")[0],
        status: "draft",
      };
    });

    const { error: mailsError } = await supabaseAdmin
      .from("scheduled_mails")
      .insert(scheduledMails);

    if (mailsError) {
      console.error("[create-order] Failed to insert scheduled_mails:", mailsError);
      return NextResponse.json({ error: mailsError.message }, { status: 500 });
    }

    // 5. Send confirmation email
    const [day, month, year] = [
      start.getDate().toString().padStart(2, "0"),
      (start.getMonth() + 1).toString().padStart(2, "0"),
      start.getFullYear(),
    ];
    const formattedStartDate = `${day}.${month}.${year}`;

    const { error: resendError } = await resend.emails.send({
      from: "Lekker Letter <noreply@lekker-letter.de>",
      to: "henningdeliusfritz@gmail.com",
      subject: `Lekker Letter für ${recipientName} ist eingerichtet 🎁`,
      html: `
        <p>${durationMonths} Monate für ${recipientName} eingerichtet.</p>
        <p>Erste Mail: ${formattedStartDate}</p>
        <p>Empfänger-Seite: <a href="https://lekker-letter.de/gift/${orderId}">https://lekker-letter.de/gift/${orderId}</a></p>
      `,
    });

    if (resendError) {
      console.error("[create-order] Failed to send confirmation email:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 500 });
    }

    // 6. Return orderId
    return NextResponse.json({ orderId }, { status: 200 });
  } catch (error) {
    console.error("[create-order] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
