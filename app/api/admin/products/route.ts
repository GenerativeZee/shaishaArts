import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, categoryId, price, description, materials, careInstructions, stock, images, isFeatured, isBestseller, isActive } = body;

    if (!name || !slug || !categoryId || price === undefined || !description) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        price: Number(price),
        description,
        materials,
        careInstructions,
        stock: Number(stock) || 0,
        images: JSON.stringify(images || []),
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isActive: isActive !== false,
      },
      include: { category: { select: { name: true, slug: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
