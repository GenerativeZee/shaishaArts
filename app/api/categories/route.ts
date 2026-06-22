import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all categories
    const allCategories = await prisma.category.findMany();

    // Separate main categories from subcategories
    const parentCategories = allCategories.filter((c) => !c.parentId);
    const subCategories = allCategories.filter((c) => c.parentId);

    // Map children to parent categories
    const categoryTree = parentCategories.map((parent) => ({
      ...parent,
      children: subCategories.filter((sub) => sub.parentId === parent.id),
    }));

    return NextResponse.json(categoryTree);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
