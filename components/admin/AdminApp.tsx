"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Post = { slug: string; title: string; excerpt: string; date: string; tags: string[]; cover: string | null; body: string; source: "file" | "db" };
type Msg = { id: number; name: string; email: string; message: string; created_at: string; read: number };
type Status = { admin: boolean; db: boolean; cloudinary: boolean; email: boolean };

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const empty: Post = { slug: "", title: "", excerpt: "", date: today(), tags: [], cover: null, body: "", source: "db" };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j as T;
}

function Setup({ status }: { status: Status }) {
  const rows: [keyof Status, string, string][] = [
    ["db", "Turso database", "TURSO_DATABASE_URL, TURSO_AUTH_TOKEN"],
    ["cloudinary", "Cloudinary uploads", "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"],
    ["email", "Contact emails", "RESEND_API_KEY, CONTACT_EMAIL"],
  ];
  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      {rows.map(([k, label, env]) => (
        <li key={k} className="rounded-2xl border border-line p-4">
          <p className="flex items-center gap-2 font-semibold">
            <span className={`h-2 w-2 rounded-full ${status[k] ? "bg-emerald-500" : "bg-amber-500"}`} />
            {label}
          </p>
          <p className="mt-1 break-words text-xs text-muted">{status[k] ? "Connected" : `Add ${env} in Vercel, then redeploy.`}</p>
        </li>
      ))}
    </ul>
  );
}

export default function AdminApp({ status }: { status: Status }) {
  const [tab, setTab] = useState<"posts" | "messages">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [edit, setEdit] = useState<Post | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    try {
      setPosts((await api<{ posts: Post[] }>("/api/admin/posts")).posts);
      setMsgs((await api<{ messages: Msg[] }>("/api/admin/messages")).messages);
    } catch (e) {
      setNote((e as Error).message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  const unread = msgs.filter((m) => !m.read).length;
  return (
    <div className="page">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker">Ememzyvisuals</p>
          <h1 className="font-display text-4xl font-extrabold">Admin</h1>
        </div>
        <div className="flex gap-2">
          <a href="/" className="btn-ghost">View site</a>
          <button onClick={logout} className="btn-ghost">Sign out</button>
        </div>
      </header>
      <div className="mt-6"><Setup status={status} /></div>
      {note && <p className="mt-4 rounded-2xl border border-line p-3 text-sm" role="status">{note}</p>}
      <div className="mt-8 flex gap-2" role="tablist">
        {(["posts", "messages"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setEdit(null); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-fg text-bg" : "glass"}`}>
            {t === "posts" ? `Posts (${posts.length})` : `Messages${unread ? ` (${unread} new)` : ""}`}
          </button>
        ))}
        {tab === "posts" && !edit && (
          <button onClick={() => setEdit({ ...empty })} className="btn-solid ml-auto" disabled={!status.db} title={status.db ? "" : "Connect Turso first"}>New post</button>
        )}
      </div>

      {tab === "posts" && !edit && (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-xs text-muted">{p.date} · /blogs/{p.slug} · {p.source === "file" ? "from the repo (read only until imported)" : "database"}</p>
              </div>
              <div className="flex gap-2">
                <a href={`/blogs/${p.slug}`} target="_blank" className="btn-ghost !py-2">Open</a>
                <button className="btn-ghost !py-2" disabled={!status.db} onClick={() => setEdit({ ...p })}>{p.source === "file" ? "Edit in database" : "Edit"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === "posts" && edit && <Editor post={edit} status={status} onDone={(msg) => { setEdit(null); setNote(msg); load(); }} />}

      {tab === "messages" && (
        <ul className="mt-6 space-y-3">
          {msgs.length === 0 && <li className="text-muted">No messages yet{status.db ? "" : " (connect Turso to store them)"}.</li>}
          {msgs.map((m) => (
            <li key={m.id} className={`glass rounded-2xl p-5 ${m.read ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{m.name} <a className="text-sm font-normal text-muted underline" href={`mailto:${m.email}`}>{m.email}</a></p>
                <p className="text-xs text-muted">{m.created_at}</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-fg/85">{m.message}</p>
              {!m.read && (
                <button className="mt-3 text-sm font-semibold underline" onClick={async () => { await api("/api/admin/messages", { method: "PATCH", body: JSON.stringify({ id: m.id }) }); load(); }}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({ post, status, onDone }: { post: Post; status: Status; onDone: (msg: string) => void }) {
  const [p, setP] = useState<Post>(post);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(false);
  const isNew = !post.slug;
  const dashes = useMemo(() => /[\u2013\u2014]/.test(p.title + p.excerpt + p.body), [p]);
  const set = (k: keyof Post, v: unknown) => setP((x) => ({ ...x, [k]: v }));

  async function upload(file: File) {
    setErr("");
    try {
      const s = await api<{ cloud: string; key: string; timestamp: number; folder: string; signature: string }>("/api/admin/sign-upload", { method: "POST" });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", s.key);
      fd.append("timestamp", String(s.timestamp));
      fd.append("folder", s.folder);
      fd.append("signature", s.signature);
      const r = await fetch(`https://api.cloudinary.com/v1_1/${s.cloud}/image/upload`, { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || "Upload failed");
      // Serve an optimised version: auto format and quality, capped width.
      return String(j.secure_url).replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
    } catch (e) {
      setErr((e as Error).message);
      return null;
    }
  }

  async function save(published: boolean) {
    setBusy(true);
    setErr("");
    try {
      await api("/api/admin/posts", { method: "POST", body: JSON.stringify({ ...p, slug: p.slug || slugify(p.title), published }) });
      onDone(published ? "Published." : "Saved as draft.");
    } catch (e) {
      setErr((e as Error).message);
    }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${p.title}" from the database?`)) return;
    await api(`/api/admin/posts?slug=${encodeURIComponent(p.slug)}`, { method: "DELETE" });
    onDone("Deleted.");
  }

  const field = "mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 outline-none focus:border-fg";
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <label className="block text-sm font-semibold">Title
          <input className={field} value={p.title} onChange={(e) => { set("title", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }} />
        </label>
        <label className="block text-sm font-semibold">Short summary
          <textarea className={field} rows={2} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </label>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Body (Markdown)</span>
          <button className="text-sm underline" onClick={() => setPreview((v) => !v)}>{preview ? "Edit" : "Preview"}</button>
        </div>
        {preview ? (
          <div className="glass prose-blog max-h-[70vh] overflow-auto rounded-2xl p-6" dangerouslySetInnerHTML={{ __html: simpleMd(p.body) }} />
        ) : (
          <textarea className={`${field} min-h-[50vh] font-mono text-sm`} value={p.body} onChange={(e) => set("body", e.target.value)} />
        )}
        {dashes && <p className="text-sm text-amber-600">This post has em or en dashes. Replace them before publishing.</p>}
      </div>
      <aside className="space-y-4">
        <label className="block text-sm font-semibold">Link (slug)
          <input className={field} value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
        </label>
        <label className="block text-sm font-semibold">Date
          <input type="date" className={field} value={p.date} onChange={(e) => set("date", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">Tags (comma separated)
          <input className={field} value={p.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
        </label>
        <div>
          <p className="text-sm font-semibold">Cover image</p>
          {p.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover} alt="" className="mt-2 w-full rounded-2xl border border-line" />
          )}
          <input type="file" accept="image/*" disabled={!status.cloudinary} className="mt-2 block w-full text-sm"
            onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const u = await upload(f); if (u) set("cover", u); } }} />
          {!status.cloudinary && <p className="mt-1 text-xs text-muted">Connect Cloudinary to upload.</p>}
          {p.cover && <button className="mt-2 text-sm underline" onClick={() => set("cover", null)}>Remove cover</button>}
        </div>
        {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
        <div className="flex flex-wrap gap-2">
          <button className="btn-solid" disabled={busy} onClick={() => save(true)}>Publish</button>
          <button className="btn-ghost" disabled={busy} onClick={() => save(false)}>Save draft</button>
          <button className="btn-ghost" onClick={() => onDone("")}>Cancel</button>
        </div>
        {!isNew && post.source === "db" && <button className="text-sm text-red-600 underline" onClick={remove}>Delete post</button>}
      </aside>
    </div>
  );
}

// Light client preview. The live page uses the full renderer on the server.
function simpleMd(md: string) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc(md)
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .split(/\n{2,}/)
    .map((b) => (b.startsWith("<h") || b.startsWith("<li") ? b : `<p>${b}</p>`))
    .join("\n");
}
