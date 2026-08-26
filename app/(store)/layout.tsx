import React from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const offer = await prisma.offer.findFirst().catch(() => null);

  return (
    <>
      <Header offer={offer} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
