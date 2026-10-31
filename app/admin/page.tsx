"use client";
// app/admin/page.tsx

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";

function AdminContent() {
  const searchParams = useSearchParams();
  const [key, setKey] = useState(searchParams.get("key") || "");
  const [tab, setTab] = useState<"site" | "gallery" | "reviews" | "blog comments">("site");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");

  // the password is checked on the server; it is kept for this browser tab only
  const check = async (k: string) => {
    if (!k) { setAuthed(false); return; }
    const r = await fetch("/api/admin/check", { method: "POST", headers: { "x-admin-key": k } }).catch(() => null);
    const ok = !!r?.ok;
    setAuthed(ok);
    if (ok) { setKey(k); try { sessionStorage.setItem("ev_admin", k); } catch {} }
  };
  useEffect(() => {
    let k = searchParams.get("key") || "";
    try { k = k || sessionStorage.getItem("ev_admin") || ""; } catch {}
    check(k);
    if (searchParams.get("key")) window.history.replaceState(null, "", "/admin"); // keep the password out of the address bar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // once signed in, every call to the admin API carries the password header
  useEffect(() => {
    if (!authed || !key) return;
    const orig = window.fetch;
    window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/api/admin/")) { const h = new Headers(init.headers); h.set("x-admin-key", key); init = { ...init, headers: h }; }
      return orig(input, init);
    };
    return () => { window.fetch = orig; };
  }, [authed, key]);

  if (authed === null) return <div className="min-h-screen" />;
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form onSubmit={(e) => { e.preventDefault(); check(pw); }} className="card-surface w-full max-w-sm space-y-4 p-6">
          <p className="font-display text-2xl font-extrabold">Admin</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" autoFocus
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/50" />
          <button className="btn-primary w-full justify-center text-sm">Sign in</button>
          {pw && authed === false && <p className="text-xs text-muted-foreground">That password did not work.</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-padded space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your portfolio content, everything you post here is visible to all visitors
          </p>
        </div>

        <div className="flex gap-0 overflow-x-auto border-b border-border">
          {((["site", "gallery", "reviews", "blog comments"] as const)).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors",
                tab === t
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "site" && <SiteAdmin adminKey={key} />}
        {tab === "blog comments" && <BlogCommentsAdmin adminKey={key} />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "reviews" && <ReviewAdmin />}
      </div>
    </div>
  );
}

// ─── GALLERY: photos and videos, uploaded straight to Cloudinary with a signed request ───
function GalleryAdmin() {
  type Item = { id: string; title: string; description: string | null; url: string; kind: "image" | "video"; poster: string | null; category: string | null; featured: number; published: number; sort: number };
  const [items, setItems] = useState<Item[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Me");
  const [featured, setFeatured] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = async () => { const r = await fetch("/api/admin/gallery"); const d = await r.json().catch(() => []); setItems(Array.isArray(d) ? d : []); };
  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file || !title.trim()) { setMsg("Pick a file and give it a title."); return; }
    setMsg(""); setProgress(0);
    const sig = await fetch("/api/admin/upload-sign", { method: "POST" }).then((r) => r.json()).catch(() => ({ error: "Could not reach the server." }));
    if (sig.error) { setMsg(sig.error); setProgress(null); return; }
    const isVideo = file.type.startsWith("video/");
    const fd = new FormData();
    fd.append("file", file); fd.append("api_key", sig.key); fd.append("timestamp", String(sig.timestamp)); fd.append("folder", sig.folder); fd.append("signature", sig.signature);
    // upload with progress (videos can be large)
    const res: { secure_url?: string; public_id?: string; width?: number; height?: number; duration?: number; error?: { message: string } } = await new Promise((resolve) => {
      const x = new XMLHttpRequest();
      x.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloud}/${isVideo ? "video" : "image"}/upload`);
      x.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
      x.onload = () => { try { resolve(JSON.parse(x.responseText)); } catch { resolve({ error: { message: "Upload failed." } }); } };
      x.onerror = () => resolve({ error: { message: "Upload failed. Check your connection." } });
      x.send(fd);
    });
    if (!res.secure_url) { setMsg(res.error?.message || "Upload failed."); setProgress(null); return; }
    // Cloudinary serves light, phone-friendly versions on the fly: q_auto,f_auto, and a poster frame for videos
    const base = `https://res.cloudinary.com/${sig.cloud}/${isVideo ? "video" : "image"}/upload`;
    const url = isVideo ? `${base}/q_auto,vc_auto/${res.public_id}.mp4` : `${base}/q_auto,f_auto,w_1600/${res.public_id}`;
    const poster = isVideo ? `${base}/so_1,q_auto,f_jpg,w_1200/${res.public_id}.jpg` : null;
    const r = await fetch("/api/admin/gallery", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: desc.trim() || null, url, kind: isVideo ? "video" : "image", poster, category, featured, width: res.width ?? null, height: res.height ?? null, duration: res.duration ?? null }) });
    setProgress(null);
    if (!r.ok) { setMsg("Uploaded, but saving to the gallery failed. Is Turso connected?"); return; }
    setFile(null); setTitle(""); setDesc(""); setFeatured(false); setMsg("Added to the gallery.");
    load();
  };
  const patch = async (id: string, body: Record<string, unknown>) => { await fetch("/api/admin/gallery", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, ...body }) }); load(); };
  const remove = async (id: string) => { if (!confirm("Remove this from the gallery?")) return; await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" }); load(); };
  const field = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/50";

  return (
    <div className="space-y-10">
      <section className="card-surface space-y-4 p-6">
        <h2 className="font-display text-xl font-extrabold">Add a photo or video</h2>
        <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
        {file && <p className="text-xs text-muted-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={field} />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="A line about it (optional)" rows={2} className={field} />
        <div className="flex flex-wrap items-center gap-4">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(field, "w-auto")}>
            {["Me", "Work", "Behind the scenes", "Talks", "Events"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Feature it first</label>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={upload} disabled={progress !== null} className="btn-primary text-sm disabled:opacity-60">{progress !== null ? `Uploading ${progress}%` : "Upload"}</button>
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-extrabold">In the gallery ({items.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.id} className={cn("card-surface overflow-hidden", !it.published && "opacity-60")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.kind === "video" ? it.poster || it.url : it.url} alt="" className="aspect-video w-full object-cover" />
              <div className="space-y-2 p-4">
                <p className="text-xs text-muted-foreground">{it.kind === "video" ? "Video" : "Photo"} · {it.category || "Uncategorised"} {it.featured ? "· Featured" : ""} {!it.published ? "· Hidden" : ""}</p>
                <input defaultValue={it.title} onBlur={(e) => e.target.value !== it.title && patch(it.id, { title: e.target.value })} className={field} />
                <div className="flex flex-wrap gap-3 text-xs font-semibold">
                  <button onClick={() => patch(it.id, { featured: !it.featured })} className="hover:underline">{it.featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => patch(it.id, { published: !it.published })} className="hover:underline">{it.published ? "Hide" : "Show"}</button>
                  <button disabled={i === 0} onClick={() => patch(it.id, { sort: it.sort - 1 })} className="hover:underline disabled:opacity-30">Move up</button>
                  <button onClick={() => patch(it.id, { sort: it.sort + 1 })} className="hover:underline">Move down</button>
                  <button onClick={() => remove(it.id)} className="text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function ReviewAdmin() {
  type ReviewItem = { id: string; name: string; role?: string; company?: string; content: string; status: string; rating: number; createdAt: string };
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reviews");
      const d = await r.json();
      setReviews(Array.isArray(d) ? d : []);
    } catch { setReviews([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMsg(status === "APPROVED" ? "Approved!" : status === "REJECTED" ? "Rejected" : "Updated");
    setTimeout(() => setMsg(""), 2500);
    load();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setMsg("Deleted");
    setTimeout(() => setMsg(""), 2500);
    load();
  };

  const filtered = reviews.filter(r => r.status === filter);

  const counts = {
    PENDING:  reviews.filter(r => r.status === "PENDING").length,
    APPROVED: reviews.filter(r => r.status === "APPROVED").length,
    REJECTED: reviews.filter(r => r.status === "REJECTED").length,
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">Approve reviews to make them public on /reviews</p>
        </div>
        {msg && <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl">{msg}</span>}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-colors",
              filter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
            )}>
            {f.charAt(0) + f.slice(1).toLowerCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-bold text-foreground">No {filter.toLowerCase()} reviews</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "PENDING" ? "New reviews from /reviews appear here." : `No reviews marked as ${filter.toLowerCase()} yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-extrabold text-foreground">{r.name}</p>
                  {(r.role || r.company) && (
                    <p className="text-xs text-muted-foreground">{[r.role, r.company].filter(Boolean).join(" · ")}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{fmt(r.createdAt)} · {"★".repeat(r.rating)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {filter !== "APPROVED" && (
                    <button onClick={() => updateStatus(r.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity">
                      Approve
                    </button>
                  )}
                  {filter !== "REJECTED" && (
                    <button onClick={() => updateStatus(r.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Reject
                    </button>
                  )}
                  {filter === "REJECTED" && (
                    <button onClick={() => updateStatus(r.id, "PENDING")}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Move to Pending
                    </button>
                  )}
                  <button onClick={() => deleteReview(r.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-secondary rounded-xl px-4 py-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{r.content}</p>
              </div>
              {filter === "APPROVED" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Visible on /reviews
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <AdminContent />
    </Suspense>
  );
}

// ─── SITE: editable keys, subscribers and post stats, all stored in Turso ─────
type SiteData = {
  ready: boolean;
  keys?: { k: string; label: string; hint: string; secret: boolean; saved: boolean; value: string; fromEnv: boolean }[];
  comments?: { id: number; slug: string; name: string; body: string; t: number; hidden: number }[];
  subscribers?: { email: string; t: number }[];
  stats?: { slug: string; views: number; likes: number; shares: number }[];
};
function useSite(adminKey: string) {
  const [d, setD] = useState<SiteData | null>(null);
  const load = async () => {
    const r = await fetch("/api/admin/site", { headers: { "x-admin-key": adminKey } });
    setD(await r.json().catch(() => ({ ready: false })));
  };
  const act = async (body: Record<string, unknown>) => {
    await fetch("/api/admin/site", { method: "POST", headers: { "content-type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(body) });
    load();
  };
  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { d, act };
}
const day = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function SiteAdmin({ adminKey }: { adminKey: string }) {
  const { d, act } = useSite(adminKey);
  const [edit, setEdit] = useState<Record<string, string>>({});
  if (!d) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (!d.ready) return (
    <div className="card-surface p-6 text-sm leading-relaxed">
      <p className="font-semibold">Turso is not connected yet.</p>
      <p className="mt-2 text-muted-foreground">Create a database at turso.tech, then add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel, Project Settings, Environment Variables, and redeploy. Everything else can then be set here.</p>
    </div>
  );
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-xl font-extrabold">Keys</h2>
        <p className="mt-1 text-sm text-muted-foreground">A value saved here is used instead of the Vercel one. Leave it empty and save to go back to Vercel.</p>
        <div className="mt-4 space-y-3">
          {d.keys?.map((k) => (
            <div key={k.k} className="card-surface grid gap-3 p-4 md:grid-cols-[14rem_1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold">{k.label}</p>
                <p className="text-xs text-muted-foreground">{k.hint} {k.saved ? "Saved here." : k.fromEnv ? "Using Vercel." : "Not set."}</p>
              </div>
              <input type={k.secret ? "password" : "text"} placeholder={k.saved ? k.value : k.k} value={edit[k.k] ?? ""} onChange={(e) => setEdit({ ...edit, [k.k]: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/50" autoComplete="off" />
              <button onClick={() => { act({ action: "setKey", k: k.k, v: edit[k.k] ?? "" }); setEdit({ ...edit, [k.k]: "" }); }} className="btn-outline text-sm">Save</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl font-extrabold">Email subscribers ({d.subscribers?.length ?? 0})</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-outline text-sm" onClick={() => {
            const csv = "email,date\n" + (d.subscribers ?? []).map((x) => `${x.email},${new Date(x.t).toISOString()}`).join("\n");
            const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "subscribers.csv"; a.click();
          }}>Download CSV</button>
        </div>
        <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
          {d.subscribers?.map((x) => (
            <li key={x.email} className="flex items-center justify-between gap-3 py-2.5">
              <span>{x.email}</span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">{day(x.t)}
                <button onClick={() => confirm(`Remove ${x.email}?`) && act({ action: "deleteSubscriber", email: x.email })} className="hover:text-foreground">Remove</button></span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-extrabold">Blog stats</h2>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground"><tr><th className="py-2">Post</th><th>Views</th><th>Likes</th><th>Shares</th></tr></thead>
          <tbody className="divide-y divide-border">
            {d.stats?.map((x) => <tr key={x.slug}><td className="py-2 pr-3">{x.slug}</td><td>{x.views}</td><td>{x.likes}</td><td>{x.shares}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function BlogCommentsAdmin({ adminKey }: { adminKey: string }) {
  const { d, act } = useSite(adminKey);
  if (!d) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (!d.ready) return <p className="text-sm text-muted-foreground">Connect Turso first (see the Site tab).</p>;
  if (!d.comments?.length) return <p className="text-sm text-muted-foreground">No blog comments yet.</p>;
  return (
    <ul className="space-y-3">
      {d.comments.map((c) => (
        <li key={c.id} className={cn("card-surface p-4", c.hidden && "opacity-60")}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span><b className="text-foreground">{c.name}</b> on /blog/{c.slug} · {day(c.t)} {c.hidden ? "· hidden" : ""}</span>
            <span className="flex gap-3">
              <button onClick={() => act({ action: "hideComment", id: c.id, hidden: !c.hidden })} className="font-semibold text-foreground hover:underline">{c.hidden ? "Show" : "Hide"}</button>
              <button onClick={() => confirm("Delete this comment for good?") && act({ action: "deleteComment", id: c.id })} className="font-semibold text-red-500 hover:underline">Delete</button>
            </span>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
