// app/api/views/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "No slug" }, { status: 400 });

    const blog = await prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    return NextResponse.json({ views: blog.views });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
