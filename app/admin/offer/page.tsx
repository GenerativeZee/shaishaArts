import React from "react";
import { prisma } from "@/lib/prisma";
import OfferEditor from "@/components/admin/OfferEditor";

export const dynamic = "force-dynamic";

export default async function AdminOfferPage() {
  const offer = await prisma.offer.findFirst();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sitewide Offer</h1>
        <p className="text-gray-500 text-sm mt-1">
          Shown in the header announcement bar and the homepage banner. Turn it off when there&apos;s no active promotion.
        </p>
      </div>

      <OfferEditor offer={offer} />
    </>
  );
}
