"use client";
// app/blog/[slug]/PostActions.tsx
// Views, likes, shares and comments for one post, stored in Turso through /api/blog/[slug].
// On desktop the actions sit in a sticky rail beside the article, on phones in a bar at the bottom.

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, Heart, Link2, MessageCircle, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Comment = { id: number; name: string; body: string; t: number };
type Snap = { ready: boolean; views: number; likes: number; shares: number; liked: boolean; comments: Comment[] };

function visitorId() {
  try {
    let v = localStorage.getItem("ev_vid");
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem("ev_vid", v);
    }
    return v;
  } catch {
    return "anon";
  }
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const WAIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="#25D366" aria-hidden><path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0012.05 0zm0 21.79a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.88 9.88 0 019.88 9.89c0 5.45-4.44 9.88-9.89 9.88zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z" /></svg>
);
const LIIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="#0A66C2" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
);
const FBIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="#1877F2" aria-hidden><path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z" /></svg>
);

export function PostActions({ slug, title, url }: { slug: string; title: string; url: string }) {
  const [s, setS] = useState<Snap>({ ready: true, views: 0, likes: 0, shares: 0, liked: false, comments: [] });
  const [pop, setPop] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", body: "" });
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const vid = useRef("");

  const send = useCallback(
    async (action: string, extra: Record<string, string> = {}) => {
      const r = await fetch(`/api/blog/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, vid: vid.current, ...extra }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) setS(j);
      return { ok: r.ok, j };
    },
    [slug],
  );

  useEffect(() => {
    vid.current = visitorId();
    fetch(`/api/blog/${slug}?vid=${vid.current}`).then((r) => r.json()).then(setS).catch(() => {});
    // count one view per browser per post per day
    const key = `ev_view_${slug}_${new Date().toISOString().slice(0, 10)}`;
    try {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        send("view");
      }
    } catch {
      send("view");
    }
  }, [slug, send]);

  const like = () => {
    const was = s.liked;
    setS((v) => ({ ...v, liked: !was, likes: Math.max(0, v.likes + (was ? -1 : 1)) }));
    if (!was) setPop((n) => n + 1);
    send(was ? "unlike" : "like");
  };

  const share = async (where: string) => {
    const t = encodeURIComponent(`${title} by Emmanuel Ariyo`);
    const u = encodeURIComponent(url);
    const links: Record<string, string> = {
      x: `https://x.com/intent/post?text=${t}&url=${u}`,
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    };
    if (where === "native" && navigator.share) {
      try {
        await navigator.share({ title, url });
        send("share");
      } catch {}
      return;
    }
    if (where === "copy") {
      await navigator.clipboard?.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else window.open(links[where], "_blank", "noopener,noreferrer");
    send("share");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setNote("");
    const { ok, j } = await send("comment", form);
    setSending(false);
    if (ok) {
      setForm({ name: form.name, body: "" });
      setNote("Thanks, your comment is up.");
    } else setNote(j.error || "Could not post the comment.");
  };

  const btn = "flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors";

  const actions = (
    <>
      <button onClick={like} className={cn(btn, s.liked && "text-rose-500 hover:text-rose-500")} aria-pressed={s.liked} aria-label="Like this post">
        <span key={pop} className={cn("grid h-10 w-10 place-items-center rounded-full border border-border bg-background", pop && s.liked && "animate-[likepop_.45s_ease-out]")}>
          <Heart size={17} fill={s.liked ? "currentColor" : "none"} />
        </span>
        {s.likes}
      </button>
      <a href="#comments" className={btn} aria-label="Comments">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background"><MessageCircle size={17} /></span>
        {s.comments.length}
      </a>
      <div className="relative">
        <button onClick={() => (typeof navigator !== "undefined" && "share" in navigator && window.innerWidth < 768 ? share("native") : setShareOpen((v) => !v))} className={btn} aria-label="Share">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background"><Share2 size={17} /></span>
          {s.shares}
        </button>
        {shareOpen && (
          <div className="absolute left-full top-0 ml-3 md:block hidden z-20 w-44 rounded-xl border border-border bg-background p-1.5 shadow-card">
            {[["x", "X", <XIcon key="x" />], ["whatsapp", "WhatsApp", <WAIcon key="w" />], ["linkedin", "LinkedIn", <LIIcon key="l" />], ["facebook", "Facebook", <FBIcon key="f" />], ["copy", copied ? "Copied" : "Copy link", copied ? <Check key="c" size={15} /> : <Link2 key="c" size={15} />]].map(([k, label, icon]) => (
              <button key={k as string} onClick={() => share(k as string)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-foreground">
                {icon} {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={btn} aria-label="Views">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background"><Eye size={17} /></span>
        {s.views}
      </div>
    </>
  );

  return (
    <>
      {/* desktop rail */}
      <aside className="hidden lg:flex fixed left-[max(1.5rem,calc(50%-31rem))] top-1/3 z-30 flex-col gap-5">{actions}</aside>
      {/* phone bar */}
      <div className="lg:hidden fixed bottom-4 left-1/2 z-30 -translate-x-1/2 liquid-glass flex items-center gap-6 rounded-full border border-border !bg-background/85 px-6 py-2.5 shadow-card">
        {actions}
      </div>

      {/* share row under the article */}
      <div className="mt-12 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-semibold text-foreground">Share this post</span>
        {[["x", <XIcon key="x" />, "X"], ["whatsapp", <WAIcon key="w" />, "WhatsApp"], ["linkedin", <LIIcon key="l" />, "LinkedIn"], ["facebook", <FBIcon key="f" />, "Facebook"]].map(([k, icon, label]) => (
          <button key={k as string} onClick={() => share(k as string)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-secondary">
            {icon} {label}
          </button>
        ))}
        <button onClick={() => share("copy")} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-secondary">
          {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {/* comments */}
      <section id="comments" className="mt-16 border-t border-border pt-10 pb-24 lg:pb-0">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Comments <span className="text-muted-foreground font-medium">({s.comments.length})</span>
        </h2>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            maxLength={60}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Share your thoughts"
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
          <div className="flex items-center gap-4">
            <button disabled={sending || !s.ready} className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background disabled:opacity-50">
              {sending ? "Posting..." : "Post comment"}
            </button>
            {note && <span className="text-sm text-muted-foreground">{note}</span>}
            {!s.ready && <span className="text-sm text-muted-foreground">Comments open soon.</span>}
          </div>
        </form>
        <ul className="mt-10 space-y-6">
          {s.comments.map((c) => (
            <li key={c.id} className="flex gap-4">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">
                {c.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {c.name} <span className="ml-2 text-xs font-normal text-muted-foreground">{new Date(c.t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </p>
                <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
