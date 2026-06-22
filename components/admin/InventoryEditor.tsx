"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  stock: number;
  isActive: boolean;
  firstImage: string;
  category: { name: string };
}

export default function InventoryEditor({ products }: { products: Product[] }) {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(products.map((p) => [p.id, p.stock]))
  );
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const handleSave = async (productId: string) => {
    setSaving((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock: stocks[productId] }),
      });
      if (!res.ok) throw new Error();
      toast.success("Stock updated!");
    } catch {
      toast.error("Failed to update stock.");
    } finally {
      setSaving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Stock</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => {
              const isLow = stocks[product.id] < 5;
              return (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.firstImage ? (
                        <img
                          src={product.firstImage}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                      )}
                      <span className="font-semibold text-gray-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{product.category.name}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {isLow && (
                        <span className="text-red-500 text-xs font-bold">LOW</span>
                      )}
                      <input
                        type="number"
                        min={0}
                        value={stocks[product.id]}
                        onChange={(e) =>
                          setStocks((prev) => ({
                            ...prev,
                            [product.id]: parseInt(e.target.value) || 0,
                          }))
                        }
                        className={`w-20 px-3 py-1.5 rounded-lg border text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#8B1A4A]/30 ${
                          isLow ? "border-red-300 bg-red-50 text-red-700" : "border-gray-200"
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleSave(product.id)}
                      disabled={saving[product.id]}
                      className="px-4 py-1.5 bg-[#8B1A4A] hover:bg-[#72123b] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-60 ml-auto"
                    >
                      {saving[product.id] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
