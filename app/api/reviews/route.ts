// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
});

// GET — fetch approved reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — submit a review (pending approval)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await prisma.review.create({
      data: {
        ...parsed.data,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
