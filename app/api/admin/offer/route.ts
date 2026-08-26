import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const offer = await prisma.offer.findFirst();
  return NextResponse.json(offer);
}

export async function PUT(req: NextRequest) {
  try {
    const { active, emoji, title, message, code, ctaText, ctaHref } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required" }, { status: 400 });
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
    console.error("PUT Offer Error:", error);
    return NextResponse.json({ error: "Failed to save offer" }, { status: 500 });
  }
}
