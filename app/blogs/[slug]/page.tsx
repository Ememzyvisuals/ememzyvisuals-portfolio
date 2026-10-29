import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, renderMarkdown } from "@/lib/blog";
import { profile } from "@/content/site";
import SceneMark from "@/components/SceneMark";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPosts()).filter((p) => p.source === "file").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blogs/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date, images: p.cover ? [p.cover] : ["/og.png"] },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p = await getPost(params.slug);
  if (!p) notFound();
  const all = await getPosts();
  const i = all.findIndex((x) => x.slug === p.slug);
  const next = all[i + 1] ?? all[0];
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt,
    datePublished: p.date, author: { "@type": "Person", name: profile.name, url: profile.url },
    image: p.cover ? [p.cover] : undefined, mainEntityOfPage: `${profile.url}/blogs/${p.slug}`,
  };
  return (
    <article className="page max-w-3xl pb-10 pt-32 sm:pt-40">
      <SceneMark scene="blog" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/blogs" className="text-sm font-medium text-muted hover:text-fg">Back to all posts</Link>
      <p className="mt-8 text-sm text-muted">{p.dateLabel} · {p.minutes} min read</p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold leading-[1.02]">{p.title}</h1>
      <p className="mt-5 text-xl text-fg/70">{p.excerpt}</p>
      {p.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.cover} alt="" className="mt-10 w-full rounded-xl3 border border-line" />
      )}
      <div className="prose-blog mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <p className="text-sm text-muted">Written by {profile.name}</p>
        {next && next.slug !== p.slug && (
          <Link href={`/blogs/${next.slug}`} className="btn-ghost">Next: {next.title.length > 44 ? next.title.slice(0, 42) + "..." : next.title}</Link>
        )}
      </div>
    </article>
  );
}
