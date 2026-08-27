import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { history: { orderBy: { changedAt: "asc" } } },
    });
    if (!order) {
      return NextResponse.json(
        { error: "This order could not be found — it may have been deleted." },
        { status: 404 }
      );
    }
    return NextResponse.json(order);
  } catch (error) {
    return errorResponse(error, "order");
  }
}
