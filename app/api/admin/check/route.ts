// app/api/admin/check/route.ts: tells the admin page whether its key is right, checked on the server.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  return NextResponse.json({ ok: isAdmin(req) }, { status: isAdmin(req) ? 200 : 401 });
}
