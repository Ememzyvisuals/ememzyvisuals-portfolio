// app/api/admin/reviews/route.ts: every review, for moderation.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { listReviews } from "@/lib/store";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json((await listReviews()).map((r) => ({ ...r, createdAt: new Date(r.t).toISOString() }))); }
  catch { return NextResponse.json([]); }
}
