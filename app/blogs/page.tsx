// app/blogs/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildMeta } from "@/lib/metadata";
import { allPosts, formatDay } from "@/lib/blog";
import { q } from "@/lib/turso";
import { BlogIndex, type Card } from "./BlogIndex";

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

async function stats(): Promise<Record<string, { views: number; likes: number }>> {
  try {
    const [rows] = await q(["SELECT slug, views, likes FROM post_stats"]);
    return Object.fromEntries(rows.map((r) => [r.slug as string, { views: Number(r.views || 0), likes: Number(r.likes || 0) }]));
  } catch {
    return {};
  }
}

export default async function BlogsPage() {
  const posts = allPosts();
  const s = await stats();
  const [lead, ...rest] = posts;
  const cards: Card[] = rest.map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, cover: p.cover, date: p.date, day: formatDay(p.date),
    minutes: p.minutes, topic: p.topic, views: s[p.slug]?.views ?? 0, likes: s[p.slug]?.likes ?? 0,
  }));
  const topics = Array.from(new Set(posts.map((p) => p.topic)));

  return (
    <div className="pb-20 pt-10 md:pt-14">
      <div className="container-padded">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">The blog</p>
          <h1 className="section-heading mt-3">Notes from the build.</h1>
          <p className="text-muted-foreground mt-3">
            African language AI, building products in Nigeria, and what shipping software really takes.
          </p>
        </header>

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group relative mt-12 block overflow-hidden rounded-[28px] bg-secondary">
            <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
              {lead.cover && <Image src={lead.cover} alt={lead.title} fill priority sizes="100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-6 p-6 sm:p-10">
              <div className="max-w-3xl text-white">
                <p className="text-sm font-semibold text-white/85">Featured · {lead.topic}</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.04] tracking-tight">{lead.title}</h2>
                <p className="mt-4 hidden sm:block max-w-2xl text-[15px] leading-relaxed text-white/85">{lead.excerpt}</p>
                <p className="mt-4 text-xs text-white/75">Emmanuel Ariyo · {formatDay(lead.date)} · {lead.minutes} min read</p>
              </div>
              <span className="ml-auto hidden sm:grid h-14 w-14 flex-shrink-0 place-items-center rounded-full border border-white/50 text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={24} />
              </span>
            </div>
          </Link>
        )}

        <BlogIndex posts={cards} topics={topics} />

        <section className="mt-24 rounded-[28px] bg-foreground px-6 py-14 text-center text-background sm:px-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">Building something? Let&apos;s talk.</h2>
          <p className="font-museum mx-auto mt-3 max-w-xl text-xl text-background/75">Speech AI, African language models, or a product that has to work in Nigeria.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90">Get in touch</Link>
            <Link href="/work" className="rounded-full border border-background/40 px-6 py-3 text-sm font-semibold hover:bg-background/10">See my work</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
