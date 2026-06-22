import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidTransition } from "@/lib/constants";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { history: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!isValidTransition(order.status, status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 400 }
      );
    }

    const isFirstConfirm =
      status === "CONFIRMED" &&
      !order.history.some((h) => h.status === "CONFIRMED");

    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({ where: { id }, data: { status } });

      // Write history row
      await tx.orderStatusHistory.create({ data: { orderId: id, status } });

      // Decrement stock on first CONFIRMED transition
      if (isFirstConfirm) {
        let items: { productId: string; qty: number }[] = [];
        try {
          items = JSON.parse(order.items as string);
        } catch {
          items = [];
        }
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.qty } },
          });
        }
      }
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { history: { orderBy: { changedAt: "asc" } } },
    });

    return NextResponse.json({ status: updatedOrder?.status, history: updatedOrder?.history });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
