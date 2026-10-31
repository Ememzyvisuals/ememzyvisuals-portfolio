// app/api/visitors/route.ts: the visitor counter, kept in Turso.
import { NextResponse } from "next/server";
import { q, tursoReady } from "@/lib/turso";
import { ensureTables } from "@/lib/store";

async function read(inc: boolean) {
  if (!tursoReady) return 0;
  await ensureTables();
  const [, rows] = await q(
    inc ? ["INSERT INTO counters(k, n) VALUES('visitors', 1) ON CONFLICT(k) DO UPDATE SET n = n + 1"] : ["INSERT INTO counters(k, n) VALUES('visitors', 0) ON CONFLICT(k) DO NOTHING"],
    ["SELECT n FROM counters WHERE k = 'visitors'"],
  );
  return Number(rows[0]?.n ?? 0);
}
export async function GET() { try { return NextResponse.json({ count: await read(false) }); } catch { return NextResponse.json({ count: 0 }); } }
export async function POST() { try { return NextResponse.json({ count: await read(true) }); } catch { return NextResponse.json({ count: 0 }); } }
