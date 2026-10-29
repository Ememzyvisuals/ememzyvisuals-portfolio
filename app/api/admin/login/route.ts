import { NextResponse } from "next/server";
import { adminConfigured, clientIp, passwordOk, rateLimited, sameOrigin, startSession } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  if (!adminConfigured()) return NextResponse.json({ error: "Set ADMIN_PASSWORD (at least 10 characters) in your environment first." }, { status: 503 });
  if (await rateLimited("login:" + clientIp(), 5, 15 * 60 * 1000))
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  if (!passwordOk(String(body.password || ""))) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  startSession();
  return NextResponse.json({ ok: true });
}
