// app/api/subscribe/route.ts
// Saves a newsletter email in Turso (table subscribers). Listed and exported from the admin page.
import { NextResponse } from "next/server";
import { q, tursoReady } from "@/lib/turso";

export async function POST(req: Request) {
  if (!tursoReady) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const { email } = await req.json().catch(() => ({ email: "" }));
  const e = String(email || "").trim().toLowerCase().slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  try {
    await q(
      ["CREATE TABLE IF NOT EXISTS subscribers(email TEXT PRIMARY KEY, t INTEGER)"],
      ["INSERT INTO subscribers(email, t) VALUES(?, ?) ON CONFLICT(email) DO NOTHING", e, Date.now()],
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
