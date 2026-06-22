import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const orderCode = formData.get("orderCode") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadImage(buffer, "shaisha_payment_proofs");

    // Attach screenshot to order and move to PAYMENT_VERIFICATION
    if (orderCode) {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { code: orderCode } });
        if (!order) return;

        await tx.order.update({
          where: { code: orderCode },
          data: {
            paymentScreenshot: url,
            ...(order.status === "RECEIVED" && { status: "PAYMENT_VERIFICATION" }),
          },
        });

        if (order.status === "RECEIVED") {
          await tx.orderStatusHistory.create({
            data: { orderId: order.id, status: "PAYMENT_VERIFICATION" },
          });
        }
      }).catch(() => {});
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("POST Upload Image Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
