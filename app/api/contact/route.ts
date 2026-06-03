// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    // Save to database first (always works)
    await prisma.message.create({
      data: { name, email, message },
    });

    // Send email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const contactEmail = process.env.CONTACT_EMAIL ?? email;

        await resend.emails.send({
          // IMPORTANT: On Resend free plan without domain verification,
          // you MUST use "onboarding@resend.dev" as the from address.
          // Once you verify your domain on Resend, change this to:
          // from: "Portfolio <contact@ememzyvisuals.com>"
          from: "Ememzyvisuals Portfolio <onboarding@resend.dev>",
          to: [contactEmail],
          replyTo: email,
          subject: `New message from ${name} via your portfolio`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 580px; margin: 0 auto; padding: 40px 20px; background: #fff;">
              <div style="border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">New Portfolio Message</h2>
                <p style="margin: 4px 0 0; color: #666; font-size: 13px;">Via ememzyvisuals.com</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 80px;">From</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #111;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #111;"><a href="mailto:${email}" style="color: #111;">${email}</a></td>
                </tr>
              </table>

              <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; border: 1px solid #eee;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <p style="margin: 0; font-size: 15px; color: #111; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
                <a href="mailto:${email}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; text-decoration: none;">
                  Reply to ${name}
                </a>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        // Email failed but message is saved — don't fail the request
        console.error("Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
