"use client";
// app/blogs/BlogIndex.tsx
// Search box, topic filters and the post grid (the featured post sits above it, rendered on the server).
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Heart, Eye } from "lucide-react";

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
    <section className="mt-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Recent posts</h2>
        <label className="relative block w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search posts"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm outline-none focus:border-foreground"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All", ...topics].map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${topic === t ? "border-foreground bg-foreground text-background" : "border-border text-foreground/75 hover:text-foreground hover:border-foreground/40"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              {p.cover && <Image src={p.cover} alt={p.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />}
              <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">{p.topic}</span>
            </div>
            <h3 className="mt-5 font-display text-[1.2rem] font-extrabold leading-snug tracking-tight text-foreground">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">{p.title}</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{p.excerpt}</p>
            <div className="mt-4 flex items-center gap-2.5 text-xs text-muted-foreground">
              <Image src="/images/emmanuel.jpg" alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
              <span className="font-medium text-foreground whitespace-nowrap">{p.day}</span>
              <span className="ml-auto inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1"><Clock size={12} />{p.minutes}m</span>
                <span className="inline-flex items-center gap-1"><Heart size={12} />{p.likes}</span>
                <span className="inline-flex items-center gap-1"><Eye size={12} />{p.views}</span>
              </span>
            </div>
          </Link>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No posts match that search.</p>}
      </div>
    </section>
  );
}
