import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const { code } = resolvedParams;

    const order = await prisma.order.findUnique({
      where: { code: code },
      include: {
        history: {
          orderBy: { changedAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Parse items JSON safely
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(order.items);
    } catch {
      // empty
    }

    // Mask sensitive details to prevent unauthorized access via public URL
    const publicOrder = {
      code: order.code,
      customerName: order.customerName,
      items: parsedItems,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentScreenshot: order.paymentScreenshot,
      giftMessage: order.giftMessage,
      status: order.status,
      history: order.history,
      createdAt: order.createdAt,
    };

    return NextResponse.json(publicOrder);
  } catch (error) {
    console.error("GET Order By Code Error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

// Support updating payment screenshot for the order code
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const { code } = resolvedParams;
    const body = await req.json();
    const { paymentScreenshot } = body;

    if (!paymentScreenshot) {
      return NextResponse.json({ error: "paymentScreenshot is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { code: code },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order with paymentScreenshot and transition status to PAYMENT_VERIFICATION
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { code: code },
        data: {
          paymentScreenshot,
          status: "PAYMENT_VERIFICATION",
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: ord.id,
          status: "PAYMENT_VERIFICATION",
        },
      });

      return ord;
    });

    return NextResponse.json({
      code: updatedOrder.code,
      status: updatedOrder.status,
      paymentScreenshot: updatedOrder.paymentScreenshot,
    });
  } catch (error) {
    console.error("PATCH Order Payment Error:", error);
    return NextResponse.json({ error: "Failed to upload payment proof" }, { status: 500 });
  }
}
