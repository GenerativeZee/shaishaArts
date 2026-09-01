import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/orderCode";
import { computeDiscount, couponMatches } from "@/lib/coupon";
import { effectivePrice } from "@/lib/price";
import { MIN_ORDER_VALUE, shippingFeeFor } from "@/lib/constants";

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
      couponCode,
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

    // Reject malformed/negative/non-integer quantities before touching stock or pricing
    for (const item of items) {
      if (!item.productId || !Number.isInteger(item.qty) || item.qty <= 0 || item.qty > 100) {
        return NextResponse.json({ error: "Invalid item quantity" }, { status: 400 });
      }
    }

    // Aggregate duplicate productId entries so stock is checked against the true combined quantity
    const qtyByProductId = new Map<string, number>();
    for (const item of items) {
      qtyByProductId.set(item.productId, (qtyByProductId.get(item.productId) || 0) + item.qty);
    }

    // Process and validate items + calculate total amount from DB prices
    let computedTotal = 0;
    const orderItemsToSave: { productId: string; name: string; qty: number; price: number; image: string; slug: string }[] = [];

    for (const [productId, qty] of qtyByProductId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 });
      }

      if (!product.isActive) {
        return NextResponse.json({ error: `Product ${product.name} is no longer active` }, { status: 400 });
      }

      if (product.stock < qty) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` }, { status: 400 });
      }

      // Honour the per-product offer price when one is set
      const unitPrice = effectivePrice(product);
      computedTotal += unitPrice * qty;

      // Get primary image
      let primaryImage = "";
      try {
        const parsed: string[] = JSON.parse(product.images);
        primaryImage = parsed[0] || "";
      } catch {
        // empty
      }

      orderItemsToSave.push({
        productId: product.id,
        name: product.name,
        qty,
        price: unitPrice,
        image: primaryImage,
        slug: product.slug,
      });
    }

    // Enforce the minimum order value against the items subtotal
    if (computedTotal < MIN_ORDER_VALUE) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${MIN_ORDER_VALUE}. Please add more items before checking out.` },
        { status: 400 }
      );
    }

    // Validate coupon and compute discount server-side (never trust client-sent amounts)
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    if (couponCode) {
      const offer = await prisma.offer.findFirst();
      if (!couponMatches(offer, couponCode)) {
        return NextResponse.json({ error: "Invalid or expired coupon code." }, { status: 400 });
      }
      discountAmount = computeDiscount(offer!, computedTotal);
      appliedCouponCode = offer!.code;
    }

    // Flat shipping fee, waived once the items subtotal clears the free-shipping threshold
    const shippingFee = shippingFeeFor(computedTotal);
    const finalTotal = computedTotal - discountAmount + shippingFee;

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
          totalAmount: finalTotal,
          couponCode: appliedCouponCode,
          discountAmount,
          shippingFee,
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
      { code: newOrder.code, totalAmount: newOrder.totalAmount, shippingFee: newOrder.shippingFee, status: newOrder.status },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
