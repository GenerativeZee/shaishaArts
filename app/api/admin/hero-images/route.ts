import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-error";

export async function GET() {
  const images = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "The image didn't upload correctly. Try choosing the file again." }, { status: 400 });
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
    return errorResponse(error, "hero image");
  }
}
