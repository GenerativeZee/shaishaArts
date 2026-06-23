import React from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { prisma } from "@/lib/prisma";
import { Plus, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-right">Price</th>
                  <th className="px-5 py-3 text-right">Stock</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Flags</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  let firstImage = "";
                  try {
                    const imgs = JSON.parse(product.images);
                    firstImage = imgs[0] || "";
                  } catch {}

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {firstImage ? (
                            <img src={firstImage} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                          )}
                          <span className="font-semibold text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{product.category.name}</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-800">₹{product.price}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-bold ${product.stock < 5 ? "text-red-500" : "text-gray-800"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center text-xs text-gray-500">
                        {product.isFeatured && <span className="mr-1">⭐</span>}
                        {product.isBestseller && <span>🔥</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-gray-400 hover:text-[#8B1A4A] hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                      No products yet.{" "}
                      <Link href="/admin/products/new" className="text-[#8B1A4A] font-bold hover:underline">
                        Add your first product
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
