import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, slug: true, stock: true, isActive: true, category: { select: { name: true } } },
      orderBy: { stock: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return errorResponse(error, "inventory");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { productId, stock } = await req.json();
    if (!productId || stock === undefined || Number(stock) < 0 || Number.isNaN(Number(stock))) {
      return NextResponse.json({ error: "Enter a stock quantity of 0 or more." }, { status: 400 });
    }
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: Math.round(Number(stock)) },
      select: { id: true, name: true, stock: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    return errorResponse(error, "stock level");
  }
}
