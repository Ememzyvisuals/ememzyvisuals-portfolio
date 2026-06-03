// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { BlogInteractions } from "./BlogInteractions";

export const revalidate = 60;
interface Props { params: { slug: string } }

async function getBlog(slug: string) {
  try {
    return await prisma.blog.findUnique({
      where: { slug, published: true },
      include: { comments: { where: { approved: true }, orderBy: { createdAt: "desc" } } }
    });
  } catch { return null; }
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
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-secondary border border-border rounded-xl p-4 overflow-x-auto my-5"><code class="text-sm font-mono text-foreground">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4 tracking-tight">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-3 tracking-tight">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="text-muted-foreground leading-relaxed ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc space-y-1.5 my-4">$&</ul>')
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-border pl-4 my-4 text-muted-foreground italic">$1</blockquote>')
    .replace(/^(?!<[a-z])(.+)$/gm, '<p class="text-muted-foreground leading-relaxed my-3">$1</p>')
    .replace(/<p[^>]*>\s*<\/p>/g, '');
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const htmlContent = renderMarkdown(blog.content);
  const shareUrl = `https://ememzyvisuals.vercel.app/blog/${blog.slug}`;
  const shareText = `${blog.title} by Emmanuel Ariyo`;

  return (
    <article className="py-16 md:py-24">
      <div className="container-padded max-w-3xl">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={15} /> Back to Blogs
        </Link>
        <div className="space-y-5 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-xs">{blog.category}</span>
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground"><Tag size={10} />{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{blog.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{blog.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">E</div>
              <span>{siteConfig.author.name}</span>
            </div>
            {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
            {blog.readingTime && <span className="flex items-center gap-1"><Clock size={13} />{blog.readingTime} min read</span>}
            <span className="ml-auto text-xs">{blog.views} views</span>
          </div>
        </div>
        {blog.coverImage && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        {blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-2">
            {blog.tags.map((tag) => <span key={tag} className="tech-badge">{tag}</span>)}
          </div>
        )}
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
        <div className="mt-10">
          <Link href="/blogs" className="btn-outline text-sm"><ArrowLeft size={14} /> More Posts</Link>
        </div>
      </div>
    </article>
  );
}
