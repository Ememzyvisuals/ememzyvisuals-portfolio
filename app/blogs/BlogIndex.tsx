"use client";
// app/blogs/BlogIndex.tsx
// Search box, topic filters and the post grid (the featured post sits above it, rendered on the server).
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, Eye } from "lucide-react";

export type Card = {
  slug: string; title: string; excerpt: string; cover: string | null; date: string; day: string;
  minutes: number; topic: string; views: number; likes: number;
};

export function BlogIndex({ posts, topics }: { posts: Card[]; topics: string[] }) {
  const [topic, setTopic] = useState("All");
  const [term, setTerm] = useState("");
  const list = useMemo(() => {
    const t = term.trim().toLowerCase();
    return posts.filter((p) => (topic === "All" || p.topic === topic) && (!t || (p.title + " " + p.excerpt).toLowerCase().includes(t)));
  }, [posts, topic, term]);

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-4 border-b border-border md:flex-row md:items-center md:justify-between">
        <div className="-mb-px flex gap-6 overflow-x-auto">
          {["All", ...topics].map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${topic === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="relative mb-3 block w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search posts"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-foreground/50"
          />
        </label>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card-surface group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
              {p.cover && <Image src={p.cover} alt={p.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="text-xs font-medium text-muted-foreground">{p.topic} · {p.minutes} min read</p>
              <h3 className="mt-2.5 font-display text-lg font-bold leading-snug tracking-tight text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65 line-clamp-3">{p.excerpt}</p>
              <div className="mt-auto flex items-center gap-2 pt-6 text-xs text-muted-foreground">
                <span>{p.day}</span>
                <span className="ml-auto inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Eye size={13} />{p.views}</span>
                  <span className="inline-flex items-center gap-1"><Heart size={13} />{p.likes}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No posts match that search.</p>}
      </div>
    </section>
  );
}
