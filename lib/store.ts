// lib/store.ts
// Site data kept in Turso (replaces the old Postgres/Prisma database): gallery items, reviews,
// the visitor counter and a log of contact messages. Tables are created on first use.
import { q } from "@/lib/turso";

let ready: Promise<unknown> | null = null;
export function ensureTables() {
  ready ??= q(
    ["CREATE TABLE IF NOT EXISTS gallery(id TEXT PRIMARY KEY, title TEXT, description TEXT, url TEXT, kind TEXT DEFAULT 'image', poster TEXT, category TEXT, featured INTEGER DEFAULT 0, published INTEGER DEFAULT 1, sort INTEGER DEFAULT 0, width INTEGER, height INTEGER, duration REAL, t INTEGER)"],
    ["CREATE TABLE IF NOT EXISTS reviews(id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, company TEXT, content TEXT, rating INTEGER DEFAULT 5, status TEXT DEFAULT 'PENDING', t INTEGER)"],
    ["CREATE TABLE IF NOT EXISTS counters(k TEXT PRIMARY KEY, n INTEGER DEFAULT 0)"],
    ["CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, body TEXT, t INTEGER)"],
  ).catch((e) => { ready = null; throw e; });
  return ready;
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export type GalleryItem = { id: string; title: string; description: string | null; url: string; kind: "image" | "video"; poster: string | null; category: string | null; featured: number; published: number; sort: number; width: number | null; height: number | null; duration: number | null; t: number };
export type Review = { id: string; name: string; email?: string; role: string | null; company: string | null; content: string; rating: number; status: string; t: number };

export async function listGallery(all = false): Promise<GalleryItem[]> {
  await ensureTables();
  const [rows] = await q([`SELECT * FROM gallery ${all ? "" : "WHERE published = 1"} ORDER BY featured DESC, sort ASC, t DESC`]);
  return rows as unknown as GalleryItem[];
}

export async function listReviews(status?: string): Promise<Review[]> {
  await ensureTables();
  const [rows] = await q(status ? ["SELECT id, name, role, company, content, rating, status, t FROM reviews WHERE status = ? ORDER BY t DESC", status] : ["SELECT * FROM reviews ORDER BY t DESC"]);
  return rows as unknown as Review[];
}
