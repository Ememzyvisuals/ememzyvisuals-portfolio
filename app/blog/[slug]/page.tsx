// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { BlogInteractions } from "./BlogInteractions";

export const revalidate = 60;
interface Props { params: { slug: string } }

async function getBlog(slug: string) {
  try {
    return await prisma.blog.findUnique({
      where: { slug, published: true },
      include: { comments: { where: { approved: true }, orderBy: { createdAt: "desc" } } },
    });
  } catch { return null; }
}

async function getRelatedPosts(slug: string, category: string) {
  try {
    // Same category first, exclude current post
    const related = await prisma.blog.findMany({
      where: { published: true, slug: { not: slug }, category },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, category: true, readingTime: true, publishedAt: true },
    });
    // If fewer than 3, fill with recent posts from any category
    if (related.length < 3) {
      const extra = await prisma.blog.findMany({
        where: {
          published: true,
          slug: { not: slug },
          category: { not: category },
        },
        orderBy: { publishedAt: "desc" },
        take: 3 - related.length,
        select: { slug: true, title: true, excerpt: true, category: true, readingTime: true, publishedAt: true },
      });
      return [...related, ...extra];
    }
    return related;
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return {};
  const ogImg = `https://ememzyvisuals.vercel.app/og/og-image.png`;
  return {
    title: `${blog.title} | ${siteConfig.name}`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title, description: blog.excerpt, type: "article",
      url: `https://ememzyvisuals.vercel.app/blog/${blog.slug}`,
      images: [{ url: blog.coverImage || ogImg, width: 1200, height: 630 }],
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [siteConfig.author.name],
    },
    twitter: { card: "summary_large_image", title: blog.title, description: blog.excerpt },
  };
}

function renderMarkdown(content: string): string {
  return content
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-secondary border border-border rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm font-mono text-foreground">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-extrabold mt-10 mb-4 tracking-tight text-foreground">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-extrabold mt-8 mb-3 tracking-tight text-foreground">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-extrabold mt-6 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-extrabold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-foreground/90">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-foreground underline underline-offset-4 font-semibold hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="text-foreground/80 leading-relaxed ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc space-y-1.5 my-4">$&</ul>')
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-foreground/30 pl-5 my-5 text-foreground/70 italic">$1</blockquote>')
    .replace(/^(?!<[a-z])(.+)$/gm, '<p class="text-foreground/80 leading-[1.85] my-4 text-[1.05rem]">$1</p>')
    .replace(/<p[^>]*>\s*<\/p>/g, '');
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const related = await getRelatedPosts(params.slug, blog.category);
  const htmlContent = renderMarkdown(blog.content);
  const shareUrl = `https://ememzyvisuals.vercel.app/blog/${blog.slug}`;
  const shareText = `${blog.title} by Emmanuel Ariyo`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    url: shareUrl,
    author: {
      "@type": "Person",
      name: "Emmanuel Ariyo",
      alternateName: "Ememzyvisuals",
      url: "https://ememzyvisuals.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Ememzyvisuals",
      url: "https://ememzyvisuals.vercel.app",
    },
    datePublished: blog.publishedAt?.toISOString(),
    keywords: blog.tags.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="py-16 md:py-24">
        <div className="container-padded max-w-3xl">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 font-medium">
            <ArrowLeft size={15} /> Back to Blogs
          </Link>

          {/* Header */}
          <div className="space-y-5 mb-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill text-xs">{blog.category}</span>
              {blog.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground"><Tag size={10} />{tag}</span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">{blog.title}</h1>
            <p className="text-xl text-foreground/70 leading-relaxed">{blog.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">E</div>
                <span className="font-medium text-foreground">{siteConfig.author.name}</span>
              </div>
              {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
              {blog.readingTime && <span className="flex items-center gap-1"><Clock size={13} />{blog.readingTime} min read</span>}
              <span className="ml-auto text-xs">{blog.views} views</span>
            </div>
          </div>

          {/* Cover image */}
          {blog.coverImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content — deeper text for readability */}
          <div
            className="text-[1.05rem] leading-[1.85] text-foreground/80 space-y-1"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-2">
              {blog.tags.map((tag) => <span key={tag} className="tech-badge">{tag}</span>)}
            </div>
          )}

          {/* Share + Comments */}
          <BlogInteractions
            blogId={blog.id}
            slug={blog.slug}
            shareUrl={shareUrl}
            shareText={shareText}
            initialComments={blog.comments.map(c => ({
              id: c.id, name: c.name, content: c.content,
              createdAt: c.createdAt.toISOString(),
            }))}
          />

          {/* ─── RELATED POSTS ─────────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border">
              <h2 className="text-xl font-extrabold text-foreground mb-6 tracking-tight">
                More Posts
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {related.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block p-5 rounded-2xl border border-border bg-card hover:border-foreground transition-all duration-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-border text-muted-foreground uppercase tracking-widest">
                        {post.category}
                      </span>
                      {post.readingTime && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock size={9} />{post.readingTime}m
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Read post <ArrowRight size={11} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <Link href="/blogs" className="btn-outline text-sm"><ArrowLeft size={14} /> All Posts</Link>
          </div>
        </div>
      </article>
    </>
  );
}
