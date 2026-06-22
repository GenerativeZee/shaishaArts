import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import InventoryEditor from "@/components/admin/InventoryEditor";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      isActive: true,
      images: true,
      category: { select: { name: true } },
    },
    orderBy: { stock: "asc" },
  });

  const parsedProducts = products.map((p) => {
    let firstImage = "";
    try { firstImage = JSON.parse(p.images)[0] || ""; } catch {}
    return { ...p, firstImage };
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update stock levels.{" "}
            <span className="text-red-500 font-semibold">Red = low stock (&lt; 5)</span>
          </p>
        </div>

        <InventoryEditor products={parsedProducts} />
      </main>
    </div>
  );
}
