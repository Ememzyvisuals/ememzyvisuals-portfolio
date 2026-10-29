import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getPosts } from "@/lib/blog";

const Post = z.object({
  slug: z.string().trim().min(2).max(90).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(400).default(""),
  body: z.string().min(10).max(100_000),
  cover: z.string().url().max(500).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  published: z.boolean().default(true),
});

function guard(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  if (!isAdmin()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return null;
}

export async function GET(req: Request) {
  const g = guard(req);
  if (g) return g;
  return NextResponse.json({ posts: await getPosts(true) });
}

export async function POST(req: Request) {
  const g = guard(req);
  if (g) return g;
  const c = await db();
  if (!c) return NextResponse.json({ error: "Database not set up. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN." }, { status: 503 });
  const parsed = Post.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid post" }, { status: 400 });
  const p = parsed.data;
  if (/[\u2013\u2014]/.test(p.title + p.excerpt + p.body))
    return NextResponse.json({ error: "Remove the em or en dashes first. House rule." }, { status: 400 });
  await c.execute({
    sql: `insert into posts (slug, title, excerpt, body, cover, tags, date, published, updated_at)
          values (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          on conflict(slug) do update set title=excluded.title, excerpt=excluded.excerpt, body=excluded.body,
            cover=excluded.cover, tags=excluded.tags, date=excluded.date, published=excluded.published, updated_at=datetime('now')`,
    args: [p.slug, p.title, p.excerpt, p.body, p.cover ?? null, JSON.stringify(p.tags), p.date, p.published ? 1 : 0],
  });
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${p.slug}`);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = guard(req);
  if (g) return g;
  const c = await db();
  if (!c) return NextResponse.json({ error: "Database not set up." }, { status: 503 });
  const slug = new URL(req.url).searchParams.get("slug") || "";
  await c.execute({ sql: "delete from posts where slug = ?", args: [slug] });
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
  return NextResponse.json({ ok: true });
}
