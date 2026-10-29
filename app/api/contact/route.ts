import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { clientIp, rateLimited } from "@/lib/auth";
import { profile } from "@/content/site";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  const { name, email, message, company } = parsed.data;
  if (company) return NextResponse.json({ ok: true }); // bot
  if (await rateLimited("contact:" + clientIp(), 5, 60 * 60 * 1000))
    return NextResponse.json({ error: "Too many messages from your network. Please try again later." }, { status: 429 });

  let stored = false, mailed = false;
  try {
    const c = await db();
    if (c) {
      await c.execute({ sql: "insert into messages (name, email, message) values (?, ?, ?)", args: [name, email, message] });
      stored = true;
    }
  } catch {}
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const r = await resend.emails.send({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || profile.email,
        replyTo: email,
        subject: `New message from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
      });
      mailed = !r.error;
    } catch {}
  }
  if (!stored && !mailed) return NextResponse.json({ error: "The message service is not set up yet." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
