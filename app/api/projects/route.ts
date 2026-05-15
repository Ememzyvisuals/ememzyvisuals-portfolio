// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
