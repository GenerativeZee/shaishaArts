import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "track", 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { code, phone } = body;

    if (!code || !phone) {
      return NextResponse.json({ error: "Order Code and Phone Number are required" }, { status: 400 });
    }

    // Match must be on BOTH the code and the phone used to place the order.
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

    // Return only what the track page shows — never the customer's name,
    // address, or phone (this endpoint is public and codes are enumerable).
    return NextResponse.json({
      code: order.code,
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
