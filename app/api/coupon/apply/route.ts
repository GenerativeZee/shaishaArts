import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeDiscount, couponMatches } from "@/lib/coupon";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "code and subtotal are required" }, { status: 400 });
    }

    const offer = await prisma.offer.findFirst();
    if (!couponMatches(offer, code)) {
      return NextResponse.json({ valid: false, message: "Invalid or expired coupon code." });
    }

    const discountAmount = computeDiscount(offer!, subtotal);
    return NextResponse.json({
      valid: true,
      code: offer!.code,
      title: offer!.title,
      discountAmount,
      message: `${offer!.title} applied — you save ₹${discountAmount}!`,
    });
  } catch (error) {
    console.error("POST Coupon Apply Error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
