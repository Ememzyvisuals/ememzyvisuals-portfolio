// app/blogs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Clock, Tag } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs",
  description: `Technical writing and insights by ${siteConfig.fullName} on AI, software engineering, and building products.`,
  openGraph: { title: `Blogs | ${siteConfig.name}`, url: `${siteConfig.url}/blogs` },
  alternates: { canonical: `${siteConfig.url}/blogs` },
};

async function getBlogs() {
  try {
    return await prisma.blog.findMany({
      where: { published: true, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, readingTime: true, category: true, tags: true, publishedAt: true, featured: true },
    });
  } catch { return []; }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="py-16 md:py-24">
      <div className="container-padded space-y-12">
        <div className="max-w-2xl">
          <h1 className="section-heading">Blogs.</h1>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            Thoughts on AI, software engineering, automation, and building products that matter.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center border-2 border-dashed border-border rounded-2xl">
            <span className="text-4xl">✍️</span>
            <div>
              <p className="font-semibold text-foreground text-lg">First post coming soon</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                Blog posts will appear here. Add your first post via{" "}
                <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/admin</code>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {blogs.filter((b) => b.featured).slice(0, 1).map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="block group">
                <article className="card-surface overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {blog.coverImage && (
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden bg-secondary">
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center gap-4">
                      <span className="pill text-xs w-fit">{blog.category}</span>
                      <h2 className="text-2xl font-bold text-foreground leading-tight group-hover:underline underline-offset-4">{blog.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                        {blog.readingTime && <span className="flex items-center gap-1"><Clock size={11} /> {blog.readingTime} min read</span>}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.filter((b) => !b.featured).map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="block group">
                  <article className="card-surface overflow-hidden h-full flex flex-col hover:shadow-card-hover transition-all duration-300">
                    {blog.coverImage && (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <span className="pill text-xs w-fit">{blog.category}</span>
                      <h2 className="font-bold text-foreground leading-tight group-hover:underline underline-offset-4">{blog.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{blog.excerpt}</p>
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground"><Tag size={10} />{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
                        {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                        {blog.readingTime && <span className="flex items-center gap-1 ml-auto"><Clock size={10} /> {blog.readingTime} min</span>}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
