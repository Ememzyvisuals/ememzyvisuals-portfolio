// app/api/reviews/route.ts: public reviews. New ones wait for approval in the admin page. Kept in Turso.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { q, tursoReady } from "@/lib/turso";
import { ensureTables, listReviews, newId } from "@/lib/store";

const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
});

export async function GET() {
  if (!tursoReady) return NextResponse.json([]);
  try {
    const rows = await listReviews("APPROVED");
    return NextResponse.json(rows.map((r) => ({ ...r, createdAt: new Date(r.t).toISOString() })));
  } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  if (!tursoReady) return NextResponse.json({ error: "Reviews are not open yet" }, { status: 503 });
  try {
    const parsed = reviewSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    const d = parsed.data;
    await ensureTables();
    await q(["INSERT INTO reviews(id, name, email, role, company, content, rating, status, t) VALUES(?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)", newId(), d.name, d.email, d.role ?? null, d.company ?? null, d.content, d.rating, Date.now()]);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
