// lib/turso.ts
// Turso (libSQL in the cloud) over its HTTP API, no npm package needed.
// Env (Vercel): TURSO_DATABASE_URL (libsql://<db>-<org>.turso.io) and TURSO_AUTH_TOKEN.
// Every other setting lives in the `settings` table and is edited from the admin page.
const RAW = process.env.TURSO_DATABASE_URL || "";
const TOKEN = process.env.TURSO_AUTH_TOKEN || "";
const BASE = RAW.replace(/^libsql:\/\//, "https://").replace(/\/$/, "");
export const tursoReady = !!(BASE && TOKEN);

type Val = string | number | null;
type Stmt = [string, ...Val[]];
type Row = Record<string, Val>;

const arg = (v: Val) =>
  v === null || v === undefined
    ? { type: "null" }
    : typeof v === "number"
      ? Number.isInteger(v) ? { type: "integer", value: String(v) } : { type: "float", value: v }
      : { type: "text", value: String(v) };
const val = (c: { type: string; value?: string | number } | null) =>
  !c || c.type === "null" ? null : c.type === "integer" || c.type === "float" ? Number(c.value) : (c.value as string);

async function run(stmts: Stmt[]): Promise<Row[][]> {
  const body = {
    requests: [...stmts.map(([sql, ...a]) => ({ type: "execute", stmt: { sql, args: a.map(arg) } })), { type: "close" }],
  };
  const r = await fetch(BASE + "/v2/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("turso " + r.status);
  const j = await r.json();
  return j.results.slice(0, stmts.length).map((x: { type: string; error?: unknown; response: { result: { cols: { name: string }[]; rows: unknown[][] } } }) => {
    if (x.type !== "ok") throw new Error("sql " + JSON.stringify(x.error).slice(0, 200));
    const e = x.response.result;
    const cols = (e.cols || []).map((c) => c.name);
    return (e.rows || []).map((row) => Object.fromEntries(row.map((c, i) => [cols[i], val(c as never)])));
  });
}

// tables are created on the first request after a cold start (IF NOT EXISTS: cheap and safe to repeat)
let ready: Promise<unknown> | null = null;
function schema() {
  return (ready ||= run([
    ["CREATE TABLE IF NOT EXISTS post_stats(slug TEXT PRIMARY KEY, views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, shares INTEGER DEFAULT 0)"],
    ["CREATE TABLE IF NOT EXISTS post_likes(slug TEXT, vid TEXT, t INTEGER, PRIMARY KEY(slug, vid))"],
    ["CREATE TABLE IF NOT EXISTS post_comments(id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT, name TEXT, body TEXT, t INTEGER, hidden INTEGER DEFAULT 0)"],
    ["CREATE INDEX IF NOT EXISTS post_comments_slug ON post_comments(slug, t)"],
    ["CREATE TABLE IF NOT EXISTS settings(k TEXT PRIMARY KEY, v TEXT)"],
  ]).catch((e) => {
    ready = null;
    throw e;
  }));
}

export async function q(...stmts: Stmt[]): Promise<Row[][]> {
  if (!tursoReady || !stmts.length) return stmts.map(() => []);
  await schema();
  return run(stmts);
}

export async function getSetting(k: string): Promise<string | null> {
  try {
    const [rows] = await q(["SELECT v FROM settings WHERE k = ?", k]);
    return (rows[0]?.v as string) ?? null;
  } catch {
    return null;
  }
}
