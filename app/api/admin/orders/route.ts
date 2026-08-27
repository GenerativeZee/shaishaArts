import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { customerName: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { history: { orderBy: { changedAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return errorResponse(error, "orders list");
  }
}
