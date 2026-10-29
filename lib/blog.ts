import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { db } from "./db";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  tags: string[];
  cover: string | null;
  minutes: number;
  body: string; // markdown
  source: "file" | "db";
};

const DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {} as Record<string, string | string[]>, body: raw };
  const data: Record<string, string | string[]> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      data[k] = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      continue;
    }
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1).replace(/\\"/g, '"');
    data[k] = v;
  }
  return { data, body: m[2] };
}

const label = (d: string) =>
  new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const minutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).length / 220));

async function filePosts(): Promise<Post[]> {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".md"));
  return Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(DIR, f), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const date = String(data.date ?? "2026-01-01");
      const cover = data.cover && data.cover !== "pending" ? String(data.cover) : null;
      return {
        slug: String(data.slug ?? f.replace(/\.md$/, "")),
        title: String(data.title ?? f),
        excerpt: String(data.excerpt ?? ""),
        date,
        dateLabel: label(date),
        tags: (data.tags as string[]) ?? [],
        cover,
        minutes: minutes(body),
        body,
        source: "file" as const,
      };
    }),
  );
}

async function dbPosts(includeDrafts = false): Promise<Post[]> {
  try {
    const c = await db();
    if (!c) return [];
    const r = await c.execute(includeDrafts ? "select * from posts" : "select * from posts where published = 1");
    return r.rows.map((row) => {
      const body = String(row.body);
      const date = String(row.date);
      return {
        slug: String(row.slug),
        title: String(row.title),
        excerpt: String(row.excerpt),
        date,
        dateLabel: label(date),
        tags: JSON.parse(String(row.tags || "[]")),
        cover: row.cover ? String(row.cover) : null,
        minutes: minutes(body),
        body,
        source: "db" as const,
      };
    });
  } catch {
    return [];
  }
}

// Posts written in the admin (database) win over a file with the same slug.
export async function getPosts(includeDrafts = false): Promise<Post[]> {
  const [files, rows] = await Promise.all([filePosts(), dbPosts(includeDrafts)]);
  const map = new Map<string, Post>();
  for (const p of files) map.set(p.slug, p);
  for (const p of rows) map.set(p.slug, p);
  return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export function renderMarkdown(md: string) {
  // Bare links on their own become clickable.
  const linked = md.replace(/(^|\s)(https?:\/\/[^\s)]+)(?=\s|$)/g, (_, pre, url) => `${pre}[${url}](${url})`);
  return marked.parse(linked, { async: false, gfm: true }) as string;
}
