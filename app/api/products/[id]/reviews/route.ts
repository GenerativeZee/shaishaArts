import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  customerName: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.review.findMany({
    where: { productId: id, isApproved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, customerName: true, rating: true, comment: true, createdAt: true },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const review = await prisma.review.create({
    data: { productId: id, ...parsed.data },
  });

  return NextResponse.json(review, { status: 201 });
}
