// app/api/blog/[slug]/route.ts
// GET  -> { views, likes, shares, liked, comments[] }   (?vid= tells whether this browser liked it)
// POST -> { action: "view" | "like" | "unlike" | "share" | "comment", vid, name?, body? }
import { NextResponse } from "next/server";
import { q, tursoReady } from "@/lib/turso";
import { getPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

const clean = (s: unknown, n: number) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const upsert = (slug: string) => ["INSERT INTO post_stats(slug) VALUES(?) ON CONFLICT(slug) DO NOTHING", slug] as [string, string];

async function snapshot(slug: string, vid: string) {
  const [stats, liked, comments] = await q(
    ["SELECT views, likes, shares FROM post_stats WHERE slug = ?", slug],
    ["SELECT 1 AS y FROM post_likes WHERE slug = ? AND vid = ?", slug, vid],
    ["SELECT id, name, body, t FROM post_comments WHERE slug = ? AND hidden = 0 ORDER BY t DESC LIMIT 100", slug],
  );
  const s = stats[0] || {};
  return {
    ready: tursoReady,
    views: Number(s.views || 0),
    likes: Number(s.likes || 0),
    shares: Number(s.shares || 0),
    liked: liked.length > 0,
    comments,
  };
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  if (!getPost(params.slug)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const vid = clean(new URL(req.url).searchParams.get("vid"), 64);
  try {
    return NextResponse.json(await snapshot(params.slug, vid));
  } catch {
    return NextResponse.json({ ready: false, views: 0, likes: 0, shares: 0, liked: false, comments: [] });
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!getPost(slug)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!tursoReady) return NextResponse.json({ error: "database not configured" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const vid = clean(b.vid, 64);
  const now = Date.now();
  try {
    switch (b.action) {
      case "view":
        await q(upsert(slug), ["UPDATE post_stats SET views = views + 1 WHERE slug = ?", slug]);
        break;
      case "share":
        await q(upsert(slug), ["UPDATE post_stats SET shares = shares + 1 WHERE slug = ?", slug]);
        break;
      case "like": {
        if (!vid) break;
        const [, ins] = await q(upsert(slug), ["INSERT INTO post_likes(slug, vid, t) VALUES(?, ?, ?) ON CONFLICT DO NOTHING RETURNING 1 AS y", slug, vid, now]);
        if (ins.length) await q(["UPDATE post_stats SET likes = likes + 1 WHERE slug = ?", slug]);
        break;
      }
      case "unlike": {
        if (!vid) break;
        const [del] = await q(["DELETE FROM post_likes WHERE slug = ? AND vid = ? RETURNING 1 AS y", slug, vid]);
        if (del.length) await q(["UPDATE post_stats SET likes = MAX(likes - 1, 0) WHERE slug = ?", slug]);
        break;
      }
      case "comment": {
        const name = clean(b.name, 60);
        const body = String(b.body ?? "").trim().slice(0, 2000);
        if (name.length < 2 || body.length < 2) return NextResponse.json({ error: "Please add your name and a comment." }, { status: 400 });
        // keep link spam out: more than two links and the comment is not shown until reviewed in the admin
        const hidden = (body.match(/https?:\/\//g) || []).length > 2 ? 1 : 0;
        await q(["INSERT INTO post_comments(slug, name, body, t, hidden) VALUES(?, ?, ?, ?, ?)", slug, name, body, now, hidden]);
        break;
      }
      default:
        return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }
    return NextResponse.json(await snapshot(slug, vid));
  } catch {
    return NextResponse.json({ error: "Could not save, please try again." }, { status: 500 });
  }
}
