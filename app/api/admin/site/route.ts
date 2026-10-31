// app/api/admin/site/route.ts
// Admin data kept in Turso: editable keys (settings table), blog comments, email subscribers, post stats.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { q, tursoReady } from "@/lib/turso";
import { EDITABLE_KEYS, clearCfg } from "@/lib/config";

const mask = (v: string) => (v.length <= 8 ? "••••" : `${v.slice(0, 4)}••••${v.slice(-4)}`);

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!tursoReady) return NextResponse.json({ ready: false });
  try {
    await q(["CREATE TABLE IF NOT EXISTS subscribers(email TEXT PRIMARY KEY, t INTEGER)"]);
    const [settings, comments, subs, stats] = await q(
      ["SELECT k, v FROM settings"],
      ["SELECT id, slug, name, body, t, hidden FROM post_comments ORDER BY t DESC LIMIT 300"],
      ["SELECT email, t FROM subscribers ORDER BY t DESC"],
      ["SELECT slug, views, likes, shares FROM post_stats ORDER BY views DESC"],
    );
    const saved = Object.fromEntries(settings.map((r) => [r.k as string, r.v as string]));
    return NextResponse.json({
      ready: true,
      keys: EDITABLE_KEYS.map((x) => ({ ...x, saved: x.k in saved, value: x.k in saved ? (x.secret ? mask(saved[x.k]) : saved[x.k]) : "", fromEnv: !!process.env[x.k] })),
      comments, subscribers: subs, stats,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!tursoReady) return NextResponse.json({ error: "Turso is not configured" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  try {
    switch (b.action) {
      case "setKey":
        if (!EDITABLE_KEYS.some((x) => x.k === b.k)) return NextResponse.json({ error: "Unknown key" }, { status: 400 });
        if (String(b.v ?? "").trim()) await q(["INSERT INTO settings(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", b.k, String(b.v).trim()]);
        else await q(["DELETE FROM settings WHERE k = ?", b.k]);
        clearCfg();
        break;
      case "hideComment": await q(["UPDATE post_comments SET hidden = ? WHERE id = ?", b.hidden ? 1 : 0, Number(b.id)]); break;
      case "deleteComment": await q(["DELETE FROM post_comments WHERE id = ?", Number(b.id)]); break;
      case "deleteSubscriber": await q(["DELETE FROM subscribers WHERE email = ?", String(b.email)]); break;
      default: return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
