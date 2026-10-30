// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { allPosts, getPost, renderPost, formatDay } from "@/lib/blog";
import { PostActions } from "./PostActions";

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
  const url = `${SITE}/blog/${p.slug}`;
  const more = allPosts().filter((x) => x.slug !== p.slug).slice(0, 3);
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
      <article className="py-12 md:py-20">
        <div className="container-padded max-w-3xl">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft size={15} /> All posts
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap gap-2">
              {p.tags.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
              ))}
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-[3.4rem] font-extrabold leading-[1.04] tracking-tight text-foreground">{p.title}</h1>
            <p className="font-museum mt-5 text-xl md:text-2xl leading-snug text-foreground/80">{p.excerpt}</p>
            <div className="mt-7 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
              <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-foreground">Emmanuel Ariyo</p>
                <p className="text-xs">
                  {formatDay(p.date)} <span className="mx-1.5">·</span>
                  <Clock size={11} className="inline -mt-0.5" /> {p.minutes} min read
                </p>
              </div>
            </div>
          </header>
        </div>

        {p.cover && (
          <div className="container-padded max-w-5xl mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-secondary">
              <Image src={p.cover} alt={p.title} fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-padded max-w-3xl">
          <div className="post-body mt-12" dangerouslySetInnerHTML={{ __html: renderPost(p.body) }} />
          <PostActions slug={p.slug} title={p.title} url={url} />

          {more.length > 0 && (
            <section className="mt-20 border-t border-border pt-10">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Keep reading</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-3">
                {more.map((m) => (
                  <Link key={m.slug} href={`/blog/${m.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
                      {m.cover && <Image src={m.cover} alt={m.title} fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                    </div>
                    <h3 className="mt-3 text-[15px] font-bold leading-snug text-foreground group-hover:underline underline-offset-4">{m.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{m.minutes} min read</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
