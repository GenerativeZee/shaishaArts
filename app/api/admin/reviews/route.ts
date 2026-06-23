import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const where =
    status === "pending" ? { isApproved: false } :
    status === "approved" ? { isApproved: true } :
    {};

  const reviews = await prisma.review.findMany({
    where,
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}
