import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, slug: true, stock: true, isActive: true, category: { select: { name: true } } },
      orderBy: { stock: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Inventory GET error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { productId, stock } = await req.json();
    if (!productId || stock === undefined || stock < 0) {
      return NextResponse.json({ error: "productId and valid stock required" }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: Number(stock) },
      select: { id: true, name: true, stock: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Inventory PATCH error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
