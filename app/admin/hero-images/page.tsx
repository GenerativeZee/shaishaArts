import React from "react";
import { prisma } from "@/lib/prisma";
import HeroImageEditor from "@/components/admin/HeroImageEditor";

export const dynamic = "force-dynamic";

export default async function AdminHeroImagesPage() {
  const images = await prisma.heroImage.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Hero Images</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the 4 photos shown in the homepage hero collage. Reorder them to change which slot they appear in.
        </p>
      </div>

      <HeroImageEditor images={images} />
    </>
  );
}
