import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/orderCode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      giftMessage,
      items, // [{ productId, qty }]
    } = body;

    // Validation
    if (!customerName || !phone || !address || !city || !state || !pincode || !items || !items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (phone.length < 10) {
      return NextResponse.json({ error: "Phone number must be at least 10 digits" }, { status: 400 });
    }

    if (pincode.length < 6) {
      return NextResponse.json({ error: "Pincode must be at least 6 digits" }, { status: 400 });
    }

    // Process and validate items + calculate total amount from DB prices
    let computedTotal = 0;
    const orderItemsToSave = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (!product.isActive) {
        return NextResponse.json({ error: `Product ${product.name} is no longer active` }, { status: 400 });
      }

      if (product.stock < item.qty) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` }, { status: 400 });
      }

      computedTotal += product.price * item.qty;
      
      // Get primary image
      let primaryImage = "";
      try {
        const parsed = JSON.parse(product.images);
        primaryImage = parsed[0] || "";
      } catch {
        // empty
      }

      orderItemsToSave.push({
        productId: product.id,
        name: product.name,
        qty: item.qty,
        price: product.price,
        image: primaryImage,
        slug: product.slug,
      });
    }

    // Generate SA#### code
    const orderCode = await generateOrderCode();

    // Create Order and initial OrderStatusHistory row in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code: orderCode,
          customerName,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          items: JSON.stringify(orderItemsToSave),
          totalAmount: computedTotal,
          paymentMethod,
          giftMessage: giftMessage || null,
          status: "RECEIVED",
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "RECEIVED",
        },
      });

      return order;
    });

    return NextResponse.json(
      { code: newOrder.code, totalAmount: newOrder.totalAmount, status: newOrder.status },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
