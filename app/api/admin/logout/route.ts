import { NextResponse } from "next/server";
import { endSession, sameOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  endSession();
  return NextResponse.json({ ok: true });
}
