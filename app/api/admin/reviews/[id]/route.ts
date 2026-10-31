// app/api/admin/reviews/[id]/route.ts: approve, reject or delete a review.
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { q } from "@/lib/turso";
import { ensureTables } from "@/lib/store";

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status } = await req.json().catch(() => ({ status: "" }));
  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  try { await ensureTables(); await q(["UPDATE reviews SET status = ? WHERE id = ?", status, params.id]); return NextResponse.json({ id: params.id, status }); }
  catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { await ensureTables(); await q(["DELETE FROM reviews WHERE id = ?", params.id]); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
