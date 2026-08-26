import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const existing = await prisma.heroImage.findMany({ orderBy: { order: "desc" }, take: 1 });
    if ((await prisma.heroImage.count()) >= 4) {
      return NextResponse.json(
        { error: "Homepage hero only shows up to 4 images. Delete one before adding another." },
        { status: 400 }
      );
    }
    const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;
    const image = await prisma.heroImage.create({ data: { url, order: nextOrder } });
    return NextResponse.json(image);
  } catch (error) {
    console.error("POST Hero Image Error:", error);
    return NextResponse.json({ error: "Failed to add hero image" }, { status: 500 });
  }
}
