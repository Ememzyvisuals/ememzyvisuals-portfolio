import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { Arrow, SectionHead } from "@/components/ui";
import SceneMark from "@/components/SceneMark";

export const metadata: Metadata = { title: "Blog", description: "Notes on speech AI, shipping products and building for Nigeria." };
export const revalidate = 300;

export default async function Blogs() {
  const posts = await getPosts();
  return (
    <div className="page pb-10 pt-32 sm:pt-40">
      <SceneMark scene="blog" />
      <SectionHead kicker="Writing" title={<>Notes from<br />the build.</>} sub="Speech AI, shipping products, and what building for Nigeria teaches you." />
      <ol className="divide-y divide-line border-y border-line">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blogs/${p.slug}`} className="group grid gap-2 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-8">
              <span className="text-sm text-muted">{p.dateLabel}</span>
              <span>
                <span className="block font-display text-2xl font-bold leading-tight group-hover:underline sm:text-3xl">{p.title}</span>
                <span className="mt-2 block text-fg/70">{p.excerpt}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted group-hover:text-fg">{p.minutes} min <Arrow /></span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
