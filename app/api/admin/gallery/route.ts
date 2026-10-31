// app/api/admin/gallery/route.ts: add, edit, reorder and remove gallery photos and videos (Turso).
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/adminAuth";
import { q } from "@/lib/turso";
import { ensureTables, listGallery, newId } from "@/lib/store";

const item = z.object({
  title: z.string().min(1).max(140),
  description: z.string().max(600).optional().nullable(),
  url: z.string().url(),
  kind: z.enum(["image", "video"]).default("image"),
  poster: z.string().url().optional().nullable(),
  category: z.string().max(40).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort: z.number().int().default(0),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  duration: z.number().optional().nullable(),
});

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await listGallery(true)); } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = item.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.flatten() }, { status: 400 });
  const d = p.data, id = newId();
  try {
    await ensureTables();
    await q(["INSERT INTO gallery(id, title, description, url, kind, poster, category, featured, published, sort, width, height, duration, t) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id, d.title, d.description ?? null, d.url, d.kind, d.poster ?? null, d.category ?? null, d.featured ? 1 : 0, d.published ? 1 : 0, d.sort, d.width ?? null, d.height ?? null, d.duration ?? null, Date.now()]);
    return NextResponse.json({ id });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const p = item.partial().safeParse(b);
  if (!b.id || !p.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const cols = Object.entries(p.data).map(([k, v]) => [k, typeof v === "boolean" ? (v ? 1 : 0) : v] as const);
  if (!cols.length) return NextResponse.json({ ok: true });
  try {
    await ensureTables();
    await q([`UPDATE gallery SET ${cols.map(([k]) => `${k} = ?`).join(", ")} WHERE id = ?`, ...cols.map(([, v]) => v ?? null), b.id]);
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try { await ensureTables(); await q(["DELETE FROM gallery WHERE id = ?", id]); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
