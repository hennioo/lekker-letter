import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

// setUTCMonth overflows when the day doesn't exist in the target month (e.g. Jan 31 + 1 month → Mar 2/3).
// This helper clamps to the last valid day instead.
function addMonthsSafe(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const totalMonths = (m - 1) + months
  const newYear = y + Math.floor(totalMonths / 12)
  const newMonth = totalMonths % 12
  const lastDay = new Date(Date.UTC(newYear, newMonth + 1, 0)).getUTCDate()
  const newDay = Math.min(d, lastDay)
  return `${newYear}-${String(newMonth + 1).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`
}

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
    if (!occasion?.trim()) {
      return NextResponse.json({ error: "Missing required field: occasion" }, { status: 400 });
    }
    if (!Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json({ error: "At least one interest is required" }, { status: 400 });
    }
    if (![1, 3, 6, 12].includes(durationMonths)) {
      return NextResponse.json({ error: "durationMonths must be 1, 3, 6, or 12" }, { status: 400 });
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
      await supabaseAdmin.from("recipients").delete().eq("id", recipientId);
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
      await supabaseAdmin.from("orders").delete().eq("id", orderId);
      await supabaseAdmin.from("recipients").delete().eq("id", recipientId);
      return NextResponse.json({ error: vouchersError?.message ?? "No active vouchers found" }, { status: 500 });
    }

    // 4. Create scheduled_mails — one per month
    const scheduledMails = Array.from({ length: durationMonths }, (_, monthIndex) => ({
      order_id: orderId,
      recipient_id: recipientId,
      voucher_id: vouchers[monthIndex % vouchers.length].id,
      send_date: addMonthsSafe(startDate, monthIndex),
      status: "draft",
    }));

    const { error: mailsError } = await supabaseAdmin
      .from("scheduled_mails")
      .insert(scheduledMails);

    if (mailsError) {
      console.error("[create-order] Failed to insert scheduled_mails:", mailsError);
      await supabaseAdmin.from("orders").delete().eq("id", orderId);
      await supabaseAdmin.from("recipients").delete().eq("id", recipientId);
      return NextResponse.json({ error: mailsError.message }, { status: 500 });
    }

    // 5. Send confirmation email
    const [startYear, startMonth, startDay] = startDate.split("-");
    const formattedStartDate = `${startDay}.${startMonth}.${startYear}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lekker-letter.de";

    const { error: resendError } = await resend.emails.send({
      from: "Lekker Letter <noreply@lekker-letter.de>",
      to: giverEmail,
      subject: `Lekker Letter für ${recipientName} ist eingerichtet 🎁`,
      html: `
        <p>${durationMonths} Monate für ${recipientName} eingerichtet.</p>
        <p>Erste Mail: ${formattedStartDate}</p>
        <p>Empfänger-Seite: <a href="${baseUrl}/gift/${orderId}">${baseUrl}/gift/${orderId}</a></p>
      `,
    });

    if (resendError) {
      // Non-fatal: order was already created. Log and continue.
      console.error("[create-order] Failed to send confirmation email:", resendError);
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
