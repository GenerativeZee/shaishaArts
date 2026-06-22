import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, phone } = body;

    if (!code || !phone) {
      return NextResponse.json({ error: "Order Code and Phone Number are required" }, { status: 400 });
    }

    // Search order matching code AND phone
    const order = await prisma.order.findFirst({
      where: {
        code: { equals: code },
        phone: { equals: phone },
      },
      include: {
        history: {
          orderBy: { changedAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "No matching order found. Check your details." }, { status: 404 });
    }

    // Parse items JSON
    let parsedItems: { name: string; qty: number; price: number; image?: string }[] = [];
    try {
      parsedItems = JSON.parse(order.items);
    } catch {
      // empty
    }

    return NextResponse.json({
      code: order.code,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      status: order.status,
      history: order.history,
      items: parsedItems,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("POST Order Tracking Error:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
