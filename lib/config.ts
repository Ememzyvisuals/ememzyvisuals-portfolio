// lib/config.ts
// Keys the admin page can change without a redeploy. A value saved in the Turso settings table wins;
// otherwise the Vercel environment variable is used. Values are cached for a minute per server instance.
import { getSetting } from "@/lib/turso";

export const EDITABLE_KEYS = [
  { k: "RESEND_API_KEY", label: "Resend API key", hint: "Sends the contact form to your inbox.", secret: true },
  { k: "CONTACT_EMAIL", label: "Contact email", hint: "Where contact form messages are delivered.", secret: false },
  { k: "GROQ_API_KEY", label: "Groq API key", hint: "Powers Ask About Me.", secret: true },
] as const;

const cache = new Map<string, { v: string | null; t: number }>();

export async function cfg(k: string): Promise<string | null> {
  const hit = cache.get(k);
  if (hit && Date.now() - hit.t < 60_000) return hit.v;
  const v = (await getSetting(k)) || process.env[k] || null;
  cache.set(k, { v, t: Date.now() });
  return v;
}
export const clearCfg = () => cache.clear();
