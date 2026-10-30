"use client";
// app/blog/[slug]/Sidebar.tsx
// Recent posts, topics, subscribe and follow, beside the article on desktop and under it on phones.
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Mini = { slug: string; title: string; cover: string | null; day: string };

const FOLLOW = [
  { name: "GitHub", href: "https://github.com/ememzyvisuals", bg: "#181717", path: "M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3" },
  { name: "X", href: "https://x.com/ememzyvisuals", bg: "#000000", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ememzyvisuals", bg: "#0A66C2", path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" },
  { name: "TikTok", href: "https://tiktok.com/@ememzyvisuals", bg: "#010101", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.28 8.28 0 004.84 1.55V6.85a4.85 4.85 0 01-1.07-.16z" },
  { name: "Hugging Face", href: "https://huggingface.co/Axiveri", bg: "#FFD21E", path: "M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 7.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm7 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 18c-2.4 0-4.4-1.5-5-3.5h10c-.6 2-2.6 3.5-5 3.5z" },
];

export function Sidebar({ recent, topics }: { recent: Mini[]; topics: [string, number][] }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"" | "sending" | "done" | "error">("");
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    setState(r && r.ok ? "done" : "error");
  };
  const head = "font-display text-lg font-extrabold tracking-tight text-foreground";

  return (
    <aside className="space-y-10 lg:sticky lg:top-24">
      <section>
        <h2 className={head}>Recent posts</h2>
        <ul className="mt-5 space-y-4">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                <span className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {p.cover && <Image src={p.cover} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:underline underline-offset-4">{p.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{p.day}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={head}>Topics</h2>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {topics.map(([t, n]) => (
            <li key={t}>
              <Link href="/blogs" className="flex items-center justify-between px-4 py-3 text-sm text-foreground/80 hover:text-foreground">
                {t} <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-foreground">{n}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-foreground p-6 text-background">
        <h2 className="font-display text-lg font-extrabold tracking-tight">Get new posts by email</h2>
        <p className="mt-1 text-sm text-background/70">One email when a new post is out. No spam.</p>
        {state === "done" ? (
          <p className="mt-4 text-sm font-semibold">You are on the list. Thank you.</p>
        ) : (
          <form onSubmit={subscribe} className="mt-4 space-y-2.5">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="w-full rounded-xl bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 outline-none ring-1 ring-background/20 focus:ring-background/60" />
            <button disabled={state === "sending"} className="w-full rounded-xl bg-background px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-60">
              {state === "sending" ? "Subscribing..." : "Subscribe"}
            </button>
            {state === "error" && <p className="text-xs text-background/70">Could not subscribe right now, please try again later.</p>}
          </form>
        )}
      </section>

      <section>
        <h2 className={head}>Follow me</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {FOLLOW.map((f) => (
            <a key={f.name} href={f.href} target="_blank" rel="noopener noreferrer" aria-label={f.name} title={f.name}
              className="grid h-10 w-10 place-items-center rounded-xl transition-transform hover:-translate-y-0.5" style={{ background: f.bg }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill={f.bg === "#FFD21E" ? "#1f1f1f" : "#fff"} aria-hidden><path d={f.path} /></svg>
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
}
