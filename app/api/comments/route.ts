// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  blogId: z.string(),
  name: z.string().min(2).max(60),
  email: z.string().email(),
  content: z.string().min(3).max(1000),
});

// GET approved comments for a blog
export async function GET(req: NextRequest) {
  const blogId = req.nextUrl.searchParams.get("blogId");
  if (!blogId) return NextResponse.json([]);
  try {
    const comments = await prisma.comment.findMany({
      where: { blogId, approved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, content: true, createdAt: true },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([]);
  }
}

// POST new comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    await prisma.comment.create({ data: parsed.data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
