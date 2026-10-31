// lib/blog.ts
// Blog posts live as Markdown files in /content/blog (front matter + body). Views, likes, shares and
// comments live in Turso (lib/turso.ts), keyed by the post slug.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  topic: string;
  cover: string | null;
  minutes: number;
  body: string;
};

const DIR = path.join(process.cwd(), "content", "blog");

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const head = m ? m[1] : "";
  const body = (m ? m[2] : raw).trim();
  const get = (k: string) => {
    const line = head.split("\n").find((l) => l.startsWith(k + ":"));
    if (!line) return "";
    return line.slice(k.length + 1).trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  };
  const tags = get("tags").replace(/^\[|\]$/g, "").split(",").map((t) => t.trim()).filter(Boolean);
  const cover = get("cover");
  return {
    slug: get("slug") || file.replace(/\.md$/, ""),
    title: get("title"),
    date: get("date"),
    excerpt: get("excerpt"),
    tags,
    topic: get("topic") || "Notes",
    cover: cover && cover !== "pending" ? cover : null,
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 230)),
    body,
  };
}

export function allPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  return allPosts().find((p) => p.slug === slug) ?? null;
}

const slugify = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Section headings of a post, for the contents list. */
export function outline(md: string) {
  return md.split("\n").filter((l) => l.startsWith("## ")).map((l) => {
    const text = l.slice(3).trim();
    return { id: slugify(text), text };
  });
}

/** Markdown to HTML: h2 get ids for the contents list, "Link: url" lines become link cards. */
export function renderPost(md: string): string {
  const src = md.replace(/^Link:\s*(https?:\/\/\S+)\s*$/gm, (_m, url: string) => {
    const host = url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
    const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
    return `<a class="post-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="post-link-host">${host}</span><span class="post-link-path">${path}</span><span class="post-link-arrow" aria-hidden>↗</span></a>`;
  });
  const html = marked.parse(src, { async: false, gfm: true, breaks: false }) as string;
  return html
    .replace(/<h2>(.*?)<\/h2>/g, (_m, t: string) => `<h2 id="${slugify(t)}">${t}</h2>`)
    .replace(/<a href="(https?:[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');
}

export function formatDay(d: string) {
  const t = new Date(d + "T12:00:00Z");
  return t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
