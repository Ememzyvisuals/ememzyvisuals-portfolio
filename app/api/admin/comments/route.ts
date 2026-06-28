// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key");
  return key === process.env.NEXT_PUBLIC_ADMIN_KEY;
}

// GET all pending comments
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const status = req.nextUrl.searchParams.get("status"); // "pending" | "approved" | "all"
    const where = status === "approved" ? { approved: true }
                : status === "all"      ? {}
                :                        { approved: false };
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { blog: { select: { title: true, slug: true } } },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

// PATCH — approve or reject a comment
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, approved } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = await prisma.comment.update({
      where: { id },
      data: { approved },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — remove a comment permanently
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
