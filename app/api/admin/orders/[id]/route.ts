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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json(
        { error: "This order could not be found — it may already have been deleted." },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.orderStatusHistory.deleteMany({ where: { orderId: id } }),
      prisma.order.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "order");
  }
}
