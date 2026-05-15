import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Fixed 'Promise' capitalization
) {
  try {
    const { id } = await params; // 2. Await params before using it
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id }, // 3. Used the awaited id variable
      data: {
        status,
        moderatedAt: new Date(),
      },
    });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 4. Fixed DELETE params type
) {
  try {
    const { id } = await params; // 5. Await params in DELETE function
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
