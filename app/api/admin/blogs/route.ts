// app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().default("Engineering"),
  tags: z.array(z.string()).default([]),
  readingTime: z.number().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { publishedAt, ...rest } = parsed.data;

    const blog = await prisma.blog.upsert({
      where: { slug: parsed.data.slug },
      update: { ...rest, publishedAt: publishedAt ? new Date(publishedAt) : null },
      create: { ...rest, publishedAt: publishedAt ? new Date(publishedAt) : null },
    });

    return NextResponse.json(blog);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
