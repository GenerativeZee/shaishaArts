import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueProductSlug } from "@/lib/slug";
import { errorResponse } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, categoryId, price, description, materials, careInstructions, stock, images, isFeatured, isBestseller, isActive, isCollectionCover } = body;

    const missing = [
      !name && "name",
      !slug && "URL slug",
      !categoryId && "category",
      price === undefined && "price",
      !description && "description",
    ].filter(Boolean) as string[];
    if (missing.length) {
      const list =
        missing.length === 1
          ? missing[0]
          : `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]}`;
      return NextResponse.json(
        { error: `Please fill in the ${list} before saving.` },
        { status: 400 }
      );
    }

    const makeCover = Boolean(isCollectionCover);

    // Guarantee a unique URL slug — auto-suffix (bag-charm-2, -3, …) instead of
    // rejecting a duplicate name, matching how WordPress/Shopify behave.
    const finalSlug = await uniqueProductSlug(slug || name);

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        categoryId,
        price: Math.round(Number(price)),
        description,
        materials,
        careInstructions,
        stock: Math.round(Number(stock)) || 0,
        images: JSON.stringify(images || []),
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isActive: isActive !== false,
        isCollectionCover: makeCover,
      },
      include: { category: { select: { name: true, slug: true } } },
    });

    // Only one product per category can be the homepage tile cover. Done after
    // the create (as a plain query, no wrapping transaction) so a failed create
    // never disturbs the existing cover and the common path stays a single query.
    if (makeCover) {
      await prisma.product.updateMany({
        where: { categoryId, isCollectionCover: true, id: { not: product.id } },
        data: { isCollectionCover: false },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return errorResponse(error, "product", { slug: "URL slug", categoryId: "category" });
  }
}
