import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || ""; // "price_asc" | "price_desc"

    // Build Prisma query filter
    const whereClause: any = {
      isActive: true,
    };

    if (featured) {
      whereClause.isFeatured = true;
    }

    if (bestseller) {
      whereClause.isBestseller = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      // Find category by slug
      const cat = await prisma.category.findUnique({
        where: { slug: category },
        include: { children: true },
      });

      if (cat) {
        // If it has subcategories, query products from the category and all its children
        const categoryIds = [cat.id, ...cat.children.map((child) => child.id)];
        whereClause.categoryId = { in: categoryIds };
      }
    }

    // Sort options
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
