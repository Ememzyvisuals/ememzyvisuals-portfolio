import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin, sameOrigin } from "@/lib/auth";

export async function GET(req: Request) {
  if (!sameOrigin(req) || !isAdmin()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await db();
  if (!c) return NextResponse.json({ messages: [] });
  const r = await c.execute("select * from messages order by id desc limit 200");
  return NextResponse.json({ messages: r.rows });
}

export async function PATCH(req: Request) {
  if (!sameOrigin(req) || !isAdmin()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await db();
  const { id } = await req.json().catch(() => ({}));
  if (c && id) await c.execute({ sql: "update messages set read = 1 where id = ?", args: [Number(id)] });
  return NextResponse.json({ ok: true });
}
