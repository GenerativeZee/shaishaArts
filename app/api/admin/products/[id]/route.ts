import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueProductSlug } from "@/lib/slug";
import { errorResponse } from "@/lib/api-error";
import { parseSalePrice } from "@/lib/price";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, categoryId, price, description, materials, careInstructions, stock, images, isFeatured, isBestseller, isActive, isCollectionCover, salePrice, offerLabel } = body;

    // Keep the URL slug unique — auto-suffix rather than reject on a clash.
    const finalSlug = slug ? await uniqueProductSlug(slug, id) : undefined;

    // Validate the offer price against the regular price (new one if supplied,
    // otherwise the product's current price).
    let saleValue: number | null | undefined;
    if (salePrice !== undefined) {
      const existing =
        price !== undefined
          ? Math.round(Number(price))
          : (await prisma.product.findUnique({ where: { id }, select: { price: true } }))?.price ?? 0;
      const sale = parseSalePrice(salePrice, existing);
      if ("error" in sale) {
        return NextResponse.json({ error: sale.error }, { status: 400 });
      }
      saleValue = sale.value;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(finalSlug && { slug: finalSlug }),
        ...(categoryId && { categoryId }),
        ...(price !== undefined && { price: Math.round(Number(price)) }),
        ...(saleValue !== undefined && { salePrice: saleValue }),
        ...(offerLabel !== undefined && { offerLabel: offerLabel?.trim() || null }),
        ...(description && { description }),
        ...(materials !== undefined && { materials }),
        ...(careInstructions !== undefined && { careInstructions }),
        ...(stock !== undefined && { stock: Math.round(Number(stock)) }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isBestseller !== undefined && { isBestseller: Boolean(isBestseller) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isCollectionCover !== undefined && { isCollectionCover: Boolean(isCollectionCover) }),
      },
      include: { category: { select: { name: true, slug: true } } },
    });

    // Only one product per category can be the homepage tile cover. Done after
    // the update (plain query, no wrapping transaction) so a normal edit stays a
    // single fast query on a cold DB.
    if (isCollectionCover !== undefined && Boolean(isCollectionCover)) {
      await prisma.product.updateMany({
        where: { categoryId: product.categoryId, isCollectionCover: true, id: { not: id } },
        data: { isCollectionCover: false },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    return errorResponse(error, "product", { slug: "URL slug", categoryId: "category" });
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
    return errorResponse(error, "product");
  }
}
