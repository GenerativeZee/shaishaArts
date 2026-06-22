import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, categoryId, price, description, materials, careInstructions, stock, images, isFeatured, isBestseller, isActive } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(categoryId && { categoryId }),
        ...(price !== undefined && { price: Number(price) }),
        ...(description && { description }),
        ...(materials !== undefined && { materials }),
        ...(careInstructions !== undefined && { careInstructions }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isBestseller !== undefined && { isBestseller: Boolean(isBestseller) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: { category: { select: { name: true, slug: true } } },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
