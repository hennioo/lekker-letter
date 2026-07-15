import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAIL_DIR = path.join(process.cwd(), "mail_download");
const IMAGES_DIR = path.join(MAIL_DIR, "images");
const BUCKET = "mail-assets";
const PREFIX = "canva-2026-07";

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function ensureBucket() {
  const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
  });
  // "already exists" is fine — bucket may already be there from a prior run
  if (error && !/already exists|Duplicate/i.test(error.message)) {
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      to?: string;
      subject?: string;
    };

    const to = body.to ?? "henning.delius@gmail.com";
    const subject = body.subject ?? "Hi Lulu! Deine erste LEKKER LETTER 🎁";

    let html = await readFile(path.join(MAIL_DIR, "email.html"), "utf8");
    const imageFiles = await readdir(IMAGES_DIR);

    await ensureBucket();

    // Upload every image (upsert = idempotent) and collect its public URL
    const urlByFile = new Map<string, string>();
    for (const file of imageFiles) {
      const buf = await readFile(path.join(IMAGES_DIR, file));
      const key = `${PREFIX}/${file}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(key, buf, {
          contentType: contentTypeFor(file),
          upsert: true,
        });
      if (upErr) throw upErr;

      const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);
      urlByFile.set(file, data.publicUrl);
    }

    // Rewrite every relative images/<file> reference to the public URL
    urlByFile.forEach((url, file) => {
      html = html.split(`images/${file}`).join(url);
    });

    console.log(
      "[send-canva-letter] sending to",
      to,
      "— uploaded",
      urlByFile.size,
      "images to bucket",
      BUCKET,
    );

    const { data, error } = await resend.emails.send({
      from: "Lekker Letter <noreply@lekker-letter.de>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[send-canva-letter] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[send-canva-letter] sent:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[send-canva-letter] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
