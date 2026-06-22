import React from "react";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;
  const isNew = id === "new";

  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    isNew
      ? Promise.resolve(null)
      : prisma.product.findUnique({ where: { id }, include: { category: { select: { name: true, slug: true } } } }),
  ]);

  if (!isNew && !product) notFound();

  let images: string[] = [];
  if (product?.images) {
    try { images = JSON.parse(product.images); } catch {}
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Add New Product" : `Edit: ${product?.name}`}
          </h1>
        </div>

        <ProductForm
          categories={categories}
          product={
            product
              ? {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  categoryId: product.categoryId,
                  price: product.price,
                  description: product.description,
                  materials: product.materials || "",
                  careInstructions: product.careInstructions || "",
                  stock: product.stock,
                  images,
                  isFeatured: product.isFeatured,
                  isBestseller: product.isBestseller,
                  isActive: product.isActive,
                }
              : null
          }
        />
      </main>
    </div>
  );
}
