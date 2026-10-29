import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { db } from "./db";

// Admin auth: one password from env (ADMIN_PASSWORD). No key in URLs, nothing public.
// Session = httpOnly cookie signed with HMAC-SHA256 (ADMIN_SECRET, or derived from the password).
const COOKIE = "ev_admin";
const DAY = 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.ADMIN_SECRET || (process.env.ADMIN_PASSWORD ? "ev:" + process.env.ADMIN_PASSWORD : "");
  return s;
}

export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 10;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function passwordOk(input: string) {
  const real = process.env.ADMIN_PASSWORD || "";
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return real.length >= 10 && crypto.timingSafeEqual(a, b);
}

export function startSession() {
  const exp = Date.now() + 7 * DAY;
  const payload = `admin.${exp}`;
  cookies().set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function endSession() {
  cookies().delete(COOKIE);
}

export function isAdmin() {
  if (!adminConfigured()) return false;
  const v = cookies().get(COOKIE)?.value;
  if (!v) return false;
  const parts = v.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const good = sign(payload);
  if (good.length !== parts[2].length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(parts[2]))) return false;
  return Number(parts[1]) > Date.now();
}

export function clientIp() {
  const h = headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

// Simple rate limit: max `limit` hits per `windowMs` per key. Uses Turso when present, memory otherwise.
const mem = new Map<string, number[]>();
export async function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const c = await db().catch(() => null);
  if (c) {
    await c.execute({ sql: "delete from login_attempts where at < ?", args: [now - windowMs] });
    const r = await c.execute({ sql: "select count(*) as n from login_attempts where ip = ?", args: [key] });
    const n = Number(r.rows[0]?.n ?? 0);
    if (n >= limit) return true;
    await c.execute({ sql: "insert into login_attempts (ip, at) values (?, ?)", args: [key, now] });
    return false;
  }
  const hits = (mem.get(key) || []).filter((t) => t > now - windowMs);
  if (hits.length >= limit) return true;
  hits.push(now);
  mem.set(key, hits);
  return false;
}

// Blocks cross-site form posts to admin endpoints.
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
