// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
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

    // Save to database
    await prisma.message.create({
      data: { name, email, message },
    });

    // Send email notification (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "Portfolio <no-reply@ememzyvisuals.com>",
          to: process.env.CONTACT_EMAIL ?? "contact@ememzyvisuals.com",
          subject: `New message from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Contact Message</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <hr/>
              <p>${message.replace(/\n/g, "<br/>")}</p>
            </div>
          `,
          replyTo: email,
        });
      } catch (emailErr) {
        // Don't fail the request if email fails — message is saved to DB
        console.error("Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
