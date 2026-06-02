import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;

  const res = await fetch(`${baseUrl}/api/send-due-mails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
