// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { allPosts, getPost, renderPost, formatDay } from "@/lib/blog";
import { PostActions } from "./PostActions";
import { ShareIcons, shareLink } from "./share";
import { Sidebar } from "./Sidebar";

const SITE = "https://ememzyvisuals.vercel.app";
type Props = { params: { slug: string } };

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  const img = p.cover ? `${SITE}${p.cover}` : `${SITE}/og/og-image.png`;
  return {
    title: `${p.title} | Emmanuel Ariyo`,
    description: p.excerpt,
    alternates: { canonical: `${SITE}/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, type: "article", url: `${SITE}/blog/${p.slug}`, images: [{ url: img }], publishedTime: p.date, authors: ["Emmanuel Ariyo"] },
    twitter: { card: "summary_large_image", title: p.title, description: p.excerpt, images: [img] },
  };
}

export default function BlogPostPage({ params }: Props) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const posts = allPosts();
  const url = `${SITE}/blog/${p.slug}`;
  const others = posts.filter((x) => x.slug !== p.slug);
  const related = [...others.filter((x) => x.topic === p.topic), ...others.filter((x) => x.topic !== p.topic)].slice(0, 2);
  const topicCount = Object.entries(posts.reduce<Record<string, number>>((a, x) => ((a[x.topic] = (a[x.topic] || 0) + 1), a), {}));
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: p.cover ? `${SITE}${p.cover}` : undefined,
    url,
    datePublished: p.date,
    author: { "@type": "Person", name: "Emmanuel Ariyo", alternateName: "Ememzyvisuals", url: SITE },
    keywords: p.tags.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container-padded pb-24 pt-8 md:pt-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight size={12} />
          <Link href="/blogs" className="hover:text-foreground">Blog</Link><ChevronRight size={12} />
          <span className="truncate text-foreground/80">{p.topic}</span>
        </nav>

        <div className="mt-6 grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0">
            <span className="inline-block rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background">{p.topic}</span>
            <h1 className="mt-4 font-display text-[2.1rem] sm:text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground">{p.title}</h1>
            <p className="font-museum mt-4 text-xl md:text-2xl leading-snug text-foreground/80">{p.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-border py-4">
              <div className="flex items-center gap-3">
                <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Emmanuel Ariyo</p>
                  <p className="text-xs text-muted-foreground">{formatDay(p.date)} · <Clock size={11} className="inline -mt-0.5" /> {p.minutes} min read</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="mr-1 text-xs text-muted-foreground">Share</span>
                {(["x", "whatsapp", "linkedin", "facebook"] as const).map((k) => (
                  <a key={k} href={shareLink(k, url, p.title)} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${k}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground hover:bg-secondary">{ShareIcons[k]}</a>
                ))}
              </div>
            </div>

            {p.cover && (
              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl bg-secondary">
                <Image src={p.cover} alt={p.title} fill priority sizes="(min-width:1024px) 800px, 100vw" className="object-cover" />
              </div>
            )}

            <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: renderPost(p.body) }} />

            {p.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {p.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/80">#{t}</span>)}
              </div>
            )}

            <PostActions slug={p.slug} title={p.title} url={url} />

            {/* author box */}
            <div className="mt-14 flex flex-col gap-5 rounded-3xl bg-secondary/60 p-6 sm:flex-row sm:items-center sm:p-8">
              <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={88} height={88} className="h-20 w-20 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Written by</p>
                <p className="mt-1 font-display text-xl font-extrabold text-foreground">Emmanuel Ariyo</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                  Machine learning engineer and full-stack developer from Nigeria. I build speech and language AI for African languages and publish open models under Axiveri.
                </p>
                <Link href="/about" className="mt-3 inline-block text-sm font-semibold text-foreground underline underline-offset-4">More about me</Link>
              </div>
            </div>

            {/* related */}
            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Related posts</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                      {r.cover && <Image src={r.cover} alt={r.title} fill sizes="(min-width:640px) 400px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">{r.topic}</span>
                        <p className="mt-2 font-display text-lg font-extrabold leading-snug">{r.title}</p>
                        <p className="mt-1 text-xs text-white/75">{formatDay(r.date)} · {r.minutes} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <Sidebar
            recent={others.slice(0, 4).map((x) => ({ slug: x.slug, title: x.title, cover: x.cover, day: formatDay(x.date) }))}
            topics={topicCount}
          />
        </div>
      </div>
    </>
  );
}
