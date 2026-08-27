import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const limited = rateLimit(req, "order-by-code", 15, 60_000);
  if (limited) return limited;

  try {
    const resolvedParams = await params;
    const { code } = resolvedParams;
    const phone = req.nextUrl.searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { code: code },
      include: {
        history: {
          orderBy: { changedAt: "asc" },
        },
      },
    });

    if (!order || order.phone !== phone) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Parse items JSON safely
    let parsedItems: { name: string; qty: number; price: number; image?: string }[] = [];
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
      couponCode: order.couponCode,
      discountAmount: order.discountAmount,
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
