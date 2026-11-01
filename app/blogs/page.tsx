// app/blogs/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    <div className="pb-24 pt-10 md:pt-16">
      <div className="container-padded">
        <header className="grid gap-6 border-b border-border pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">Blog</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Writing</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-foreground/70">
              What I learn building speech and language AI for African languages, and shipping products from Nigeria.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{posts.length} posts · {topics.length} topics</p>
        </header>

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="card-surface group mt-10 grid overflow-hidden md:grid-cols-[1.15fr_1fr]">
            <div className="relative aspect-[16/10] bg-secondary md:aspect-auto md:min-h-[360px]">
              {lead.cover && <Image src={lead.cover} alt={lead.title} fill priority sizes="(min-width:768px) 55vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />}
            </div>
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="rounded-full bg-foreground px-2.5 py-1 text-background">Latest</span>
                <span>{lead.topic}</span>
              </div>
              <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">{lead.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/70 line-clamp-4">{lead.excerpt}</p>
              <div className="mt-auto flex items-center gap-3 pt-8 text-sm">
                <Image src="/images/emmanuel.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-foreground">Emmanuel Ariyo</p>
                  <p className="text-xs text-muted-foreground">{formatDay(lead.date)} · {lead.minutes} min read</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <BlogIndex posts={cards} topics={topics} />

        <section className="card-surface mt-20 grid gap-6 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Working on something like this?</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/70">Speech AI, African language models, or a product that has to work well in Nigeria. I am happy to talk it through.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90">Get in touch</Link>
            <Link href="/work" className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">See my work</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
