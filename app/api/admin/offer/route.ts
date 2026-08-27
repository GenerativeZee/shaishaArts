import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-error";

export async function GET() {
  const offer = await prisma.offer.findFirst();
  return NextResponse.json(offer);
}

export async function PUT(req: NextRequest) {
  try {
    const { active, emoji, title, message, code, ctaText, ctaHref } = await req.json();
    if (!title || !message) {
      return NextResponse.json(
        { error: "Please fill in both the offer title and message before saving." },
        { status: 400 }
      );
    }

    const existing = await prisma.offer.findFirst();
    const data = {
      active: Boolean(active),
      emoji: emoji || "🎁",
      title,
      message,
      code: code || null,
      ctaText: ctaText || "Shop the Offer",
      ctaHref: ctaHref || "/shop",
    };

    const offer = existing
      ? await prisma.offer.update({ where: { id: existing.id }, data })
      : await prisma.offer.create({ data });

    return NextResponse.json(offer);
  } catch (error) {
    return errorResponse(error, "offer");
  }
}
