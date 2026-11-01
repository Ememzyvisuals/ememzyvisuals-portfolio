// lib/adminAuth.ts
// Server-side admin check. The password lives only in the server environment (ADMIN_PASSWORD on Vercel),
// never in the code and never sent to the browser.
import { timingSafeEqual } from "crypto";

export function isAdmin(req: Request): boolean {
  const want = process.env.ADMIN_PASSWORD || "";
  const got = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key") || "";
  if (!want || !got) return false;
  const a = Buffer.from(want), b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}
