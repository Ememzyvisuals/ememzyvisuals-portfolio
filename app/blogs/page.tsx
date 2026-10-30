// app/blogs/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Clock } from "lucide-react";
import { buildMeta } from "@/lib/metadata";
import { allPosts, formatDay } from "@/lib/blog";
import { q } from "@/lib/turso";

export const revalidate = 60;

export const metadata: Metadata = buildMeta({
  title: "Blog | Emmanuel Ariyo",
  description: "Writing by Emmanuel Ariyo on African language AI, building products in Nigeria, and shipping software.",
  path: "/blogs",
  ogTitle: "Blog by Emmanuel Ariyo",
  ogSubtitle: "African language AI, building in Nigeria, shipping software",
  ogTag: "Blog",
  tags: ["Emmanuel Ariyo blog", "AI engineering Nigeria", "developer blog Nigeria"],
});

async function stats() {
  try {
    const [rows] = await q(["SELECT slug, views, likes FROM post_stats"]);
    return Object.fromEntries(rows.map((r) => [r.slug as string, { views: Number(r.views || 0), likes: Number(r.likes || 0) }]));
  } catch {
    return {} as Record<string, { views: number; likes: number }>;
  }
}

function Meta({ date, minutes, s }: { date: string; minutes: number; s?: { views: number; likes: number } }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span>{formatDay(date)}</span>
      <span className="inline-flex items-center gap-1"><Clock size={12} /> {minutes} min read</span>
      {s && <span className="inline-flex items-center gap-1"><Eye size={12} /> {s.views.toLocaleString()}</span>}
      {s && <span className="inline-flex items-center gap-1"><Heart size={12} /> {s.likes.toLocaleString()}</span>}
    </div>
  );
}

export default async function BlogsPage() {
  const posts = allPosts();
  const s = await stats();
  const [lead, ...rest] = posts;

  return (
    <div className="py-16 md:py-24">
      <div className="container-padded">
        <header className="max-w-2xl">
          <h1 className="section-heading">Blog.</h1>
          <p className="text-muted-foreground mt-3">
            Notes from building African language AI and shipping products from Nigeria.
          </p>
        </header>

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-secondary">
              {lead.cover && (
                <Image src={lead.cover} alt={lead.title} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest</p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-foreground group-hover:underline decoration-2 underline-offset-4">
                {lead.title}
              </h2>
              <p className="font-museum mt-4 text-xl text-foreground/80 leading-snug">{lead.excerpt}</p>
              <div className="mt-5"><Meta date={lead.date} minutes={lead.minutes} s={s[lead.slug]} /></div>
            </div>
          </Link>
        )}

        <div className="mt-16 md:mt-24 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
                {p.cover && (
                  <Image src={p.cover} alt={p.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                )}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold leading-snug tracking-tight text-foreground group-hover:underline decoration-2 underline-offset-4">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <div className="mt-3"><Meta date={p.date} minutes={p.minutes} s={s[p.slug]} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
