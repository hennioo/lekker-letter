import { NextResponse } from "next/server";
import { Resend } from "resend";
import LekkerLetterEmail from "@/emails/LekkerLetterEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "henningdeliusfritz@gmail.com",
      subject: "🎁 Dein erstes Lekker Letter",
      react: LekkerLetterEmail({}),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
