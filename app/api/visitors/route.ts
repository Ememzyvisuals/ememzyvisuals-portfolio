// app/api/visitors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — return current count
export async function GET() {
  try {
    const record = await prisma.visitorCount.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", count: 0 },
    });
    return NextResponse.json({ count: record.count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

// POST — increment count
export async function POST() {
  try {
    const record = await prisma.visitorCount.upsert({
      where: { id: "singleton" },
      update: { count: { increment: 1 } },
      create: { id: "singleton", count: 1 },
    });
    return NextResponse.json({ count: record.count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
