"use client";
// app/blog/[slug]/Extras.tsx
// Contents list (highlights the section being read) and the email subscribe box.
import { useEffect, useState } from "react";

export function Contents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      let cur = items[0]?.id ?? "";
      for (const el of els) if (el.getBoundingClientRect().top < 140) cur = el.id;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="Contents" className="text-sm">
      <p className="font-display text-sm font-bold text-foreground">Contents</p>
      <ul className="mt-4 space-y-1 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${active === i.id ? "border-brand font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"" | "sending" | "done" | "error">("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const r = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    setState(r && r.ok ? "done" : "error");
  };
  return (
    <section className="card-surface grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_minmax(0,360px)] md:items-center">
      <div>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">Get the next post by email</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">One short email when something new is out. Nothing else.</p>
      </div>
      {state === "done" ? (
        <p className="text-sm font-medium text-foreground">You are on the list. Thank you.</p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/50" />
          <button disabled={state === "sending"} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground disabled:opacity-60">
            {state === "sending" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {state === "error" && <p className="text-xs text-muted-foreground md:col-span-2">Could not subscribe right now. Please try again later.</p>}
    </section>
  );
}
