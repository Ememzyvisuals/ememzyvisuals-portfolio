// app/blogs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Clock, Tag } from "lucide-react";

export const revalidate = 30; // New posts appear within 30 seconds

export const metadata: Metadata = buildMeta({
  title: "Blogs — Emmanuel Ariyo | Ememzyvisuals",
  description:
    "Technical writing and insights by Emmanuel Ariyo on AI engineering, software development, automation, and building products that matter.",
  path: "/blogs",
  ogTitle: "Blogs by Emmanuel Ariyo",
  ogSubtitle: "AI · Engineering · Automation · Building things that matter",
  ogTag: "Blog",
  tags: ["Emmanuel Ariyo blog", "AI engineering blog Nigeria", "developer blog Nigeria"],
});

async function getBlogs() {
  try {
    return await prisma.blog.findMany({
      where: { published: true, publishedAt: { not: null } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      select: {
        id: true, slug: true, title: true, excerpt: true,
        coverImage: true, readingTime: true, category: true,
        tags: true, publishedAt: true, featured: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="py-16 md:py-24">
      <div className="container-padded space-y-12">

        <div className="max-w-2xl">
          <h1 className="section-heading">Blogs.</h1>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            Thoughts on AI, software engineering, automation, and building
            products that matter.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center border-2 border-dashed border-border rounded-2xl">
            <div>
              <p className="font-semibold text-foreground text-xl">No blog posts yet.</p>
              <p className="text-muted-foreground mt-2">
                Check back soon — something good is coming.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Featured post — large card */}
            {blogs.filter((b) => b.featured).slice(0, 1).map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="block group">
                <article className="card-surface overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  <div className={blog.coverImage ? "grid grid-cols-1 md:grid-cols-2" : "p-8 md:p-10"}>
                    {blog.coverImage && (
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className={blog.coverImage ? "p-8 flex flex-col justify-center gap-4" : "space-y-4"}>
                      <div className="flex flex-wrap gap-2">
                        <span className="pill text-xs">{blog.category}</span>
                        <span className="pill text-xs">Featured</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground leading-tight group-hover:underline underline-offset-4">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                        {blog.readingTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {blog.readingTime} min read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {/* Rest of posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.filter((b) => !b.featured).map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="block group">
                  <article className="card-surface overflow-hidden h-full flex flex-col hover:shadow-card-hover transition-all duration-300">
                    {blog.coverImage && (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <span className="pill text-xs w-fit">{blog.category}</span>
                      <h2 className="font-bold text-foreground leading-tight group-hover:underline underline-offset-4">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                        {blog.excerpt}
                      </p>
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Tag size={10} />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
                        {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                        {blog.readingTime && (
                          <span className="flex items-center gap-1 ml-auto">
                            <Clock size={10} /> {blog.readingTime} min
                          </span>
                        )}
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
