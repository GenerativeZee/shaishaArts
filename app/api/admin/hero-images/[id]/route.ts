import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { order } = await req.json();

  const image = await prisma.heroImage.update({
    where: { id },
    data: { order },
  });

  return NextResponse.json(image);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.heroImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
