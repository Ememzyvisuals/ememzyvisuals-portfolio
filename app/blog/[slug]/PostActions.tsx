"use client";
// app/blog/[slug]/PostActions.tsx
// The reaction row under the article (like, comment, share, save), the "Leave a reply" form and the comments.
// Counts and comments are stored in Turso through /api/blog/[slug].
import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, Check, Eye, Heart, Link2, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareIcons, shareLink } from "./share";

type Comment = { id: number; name: string; body: string; t: number };
type Snap = { ready: boolean; views: number; likes: number; shares: number; liked: boolean; comments: Comment[] };

function visitorId() {
  try {
    let v = localStorage.getItem("ev_vid");
    if (!v) { v = crypto.randomUUID(); localStorage.setItem("ev_vid", v); }
    return v;
  } catch { return "anon"; }
}

export function PostActions({ slug, title, url }: { slug: string; title: string; url: string }) {
  const [s, setS] = useState<Snap>({ ready: true, views: 0, likes: 0, shares: 0, liked: false, comments: [] });
  const [pop, setPop] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const vid = useRef("");
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const send = useCallback(async (action: string, extra: Record<string, string> = {}) => {
    const r = await fetch(`/api/blog/${slug}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, vid: vid.current, ...extra }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setS(j);
    return { ok: r.ok, j };
  }, [slug]);

  useEffect(() => {
    vid.current = visitorId();
    try { setSaved(localStorage.getItem(`ev_save_${slug}`) === "1"); } catch {}
    fetch(`/api/blog/${slug}?vid=${vid.current}`).then((r) => r.json()).then(setS).catch(() => {});
    const key = `ev_view_${slug}_${new Date().toISOString().slice(0, 10)}`;
    try { if (!localStorage.getItem(key)) { localStorage.setItem(key, "1"); send("view"); } } catch { send("view"); }
  }, [slug, send]);

  const like = () => {
    const was = s.liked;
    setS((v) => ({ ...v, liked: !was, likes: Math.max(0, v.likes + (was ? -1 : 1)) }));
    if (!was) setPop((n) => n + 1);
    send(was ? "unlike" : "like");
  };
  const save = () => {
    const v = !saved;
    setSaved(v);
    try { localStorage.setItem(`ev_save_${slug}`, v ? "1" : "0"); } catch {}
  };
  const share = async (where: string) => {
    if (where === "copy") {
      await navigator.clipboard?.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else if (where === "native") {
      try { await navigator.share({ title, url }); } catch { return; }
    } else window.open(shareLink(where, url, title), "_blank", "noopener,noreferrer");
    send("share");
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setNote("");
    const { ok, j } = await send("comment", { name: form.name, body: form.body });
    setSending(false);
    if (ok) { setForm({ ...form, body: "" }); setNote("Thanks, your comment is up."); }
    else setNote(j.error || "Could not post the comment.");
  };

  const iconBtn = "grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-secondary";
  const field = "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground focus:bg-background";

  return (
    <>
      {/* reaction row, Instagram style */}
      <div className="mt-12 rounded-2xl border border-border p-3 sm:p-4">
        <div className="flex items-center gap-1">
          <button onClick={like} aria-pressed={s.liked} aria-label={s.liked ? "Unlike" : "Like"} className={cn(iconBtn, s.liked && "text-rose-500")}>
            <Heart key={pop} size={22} fill={s.liked ? "currentColor" : "none"} className={pop && s.liked ? "animate-[likepop_.45s_ease-out]" : ""} />
          </button>
          <button onClick={() => replyRef.current?.focus()} aria-label="Comment" className={iconBtn}><MessageCircle size={22} /></button>
          <div className="relative">
            <button onClick={() => (typeof navigator !== "undefined" && "share" in navigator && window.innerWidth < 768 ? share("native") : setShareOpen((v) => !v))} aria-label="Share" className={iconBtn}>
              <Send size={21} />
            </button>
            {shareOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-border bg-background p-1.5 shadow-card">
                {(["x", "whatsapp", "linkedin", "facebook"] as const).map((k) => (
                  <button key={k} onClick={() => share(k)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground">
                    {ShareIcons[k]} {k === "x" ? "X" : k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
                <button onClick={() => share("copy")} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground">
                  {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            )}
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 pr-1 text-sm text-muted-foreground"><Eye size={16} /> {s.views.toLocaleString()}</span>
          <button onClick={save} aria-pressed={saved} aria-label="Save" className={iconBtn}><Bookmark size={21} fill={saved ? "currentColor" : "none"} /></button>
        </div>
        <p className="px-2 pt-1 text-sm text-foreground">
          <span className="font-semibold">{s.likes.toLocaleString()} {s.likes === 1 ? "like" : "likes"}</span>
          <span className="text-muted-foreground"> · {s.comments.length} {s.comments.length === 1 ? "comment" : "comments"} · {s.shares} shares</span>
        </p>
      </div>

      {/* comments */}
      <section id="comments" className="mt-14">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Leave a reply</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your email is never shown. Name and comment are required.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-foreground">Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60} className={cn(field, "mt-1.5")} />
          </label>
          <label className="block text-sm font-medium text-foreground">Email (optional)
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={120} className={cn(field, "mt-1.5")} />
          </label>
          <label className="block text-sm font-medium text-foreground sm:col-span-2">Comment
            <textarea ref={replyRef} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} maxLength={2000} placeholder="Share your thoughts" className={cn(field, "mt-1.5 resize-y")} />
          </label>
          <div className="flex items-center gap-4 sm:col-span-2">
            <button disabled={sending || !s.ready} className="rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-50">
              {sending ? "Posting..." : "Post comment"}
            </button>
            {note && <span className="text-sm text-muted-foreground">{note}</span>}
            {!s.ready && <span className="text-sm text-muted-foreground">Comments open soon.</span>}
          </div>
        </form>

        {s.comments.length > 0 && (
          <ul className="mt-12 divide-y divide-border border-t border-border">
            {s.comments.map((c) => (
              <li key={c.id} className="flex gap-4 py-6">
                <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">{c.name.slice(0, 1).toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {c.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">{new Date(c.t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
