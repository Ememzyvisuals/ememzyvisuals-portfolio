// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { allPosts, getPost, renderPost, formatDay, outline } from "@/lib/blog";
import { PostActions } from "./PostActions";
import { ShareIcons, shareLink } from "./share";
import { Contents, Subscribe } from "./Extras";

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
  const related = [...others.filter((x) => x.topic === p.topic), ...others.filter((x) => x.topic !== p.topic)].slice(0, 3);
  const toc = outline(p.body);
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
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} /> All posts
        </Link>

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{p.topic}</span> · {formatDay(p.date)} · {p.minutes} min read
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">{p.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/70">{p.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3 text-left">
              <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Emmanuel Ariyo</p>
                <p className="text-xs text-muted-foreground">AI engineer, Axiveri</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {(["x", "whatsapp", "linkedin", "facebook"] as const).map((k) => (
                <a key={k} href={shareLink(k, url, p.title)} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${k}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:bg-secondary">{ShareIcons[k]}</a>
              ))}
            </div>
          </div>
        </header>

        {p.cover && (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl bg-secondary">
            <Image src={p.cover} alt={p.title} fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28"><Contents items={toc} /></div>
          </aside>

          <article className="min-w-0 max-w-[680px]">
            <div className="post-body" dangerouslySetInnerHTML={{ __html: renderPost(p.body) }} />

            {p.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {p.tags.map((t) => <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/75">{t}</span>)}
              </div>
            )}

            <PostActions slug={p.slug} title={p.title} url={url} />

            <div className="card-surface mt-14 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
              <Image src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" width={72} height={72} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Written by</p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-foreground">Emmanuel Ariyo</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                  Machine learning engineer and full-stack developer from Nigeria. I build speech and language AI for African languages and publish open models under Axiveri.
                </p>
                <Link href="/about" className="mt-2 inline-block text-sm font-semibold text-foreground underline underline-offset-4">More about me</Link>
              </div>
            </div>
          </article>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-24 max-w-5xl">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Keep reading</h2>
              <Link href="/blogs" className="text-sm font-medium text-muted-foreground hover:text-foreground">All posts</Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card-surface group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                    {r.cover && <Image src={r.cover} alt={r.title} fill sizes="(min-width:1024px) 330px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-muted-foreground">{r.topic} · {r.minutes} min read</p>
                    <p className="mt-2 font-display text-base font-bold leading-snug text-foreground">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto mt-16 max-w-5xl"><Subscribe /></div>
      </div>
    </>
  );
}
