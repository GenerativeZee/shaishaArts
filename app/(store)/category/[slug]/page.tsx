import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: true, parent: true },
  });

  if (!category) notFound();

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const products = await prisma.product.findMany({
    where: { categoryId: { in: categoryIds }, isActive: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Header */}
      <section className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          {category.parent && (
            <Link
              href={`/category/${category.parent.slug}`}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              {category.parent.name} /
            </Link>
          )}
          <h1 className="font-serif text-4xl font-bold text-gray-900 mt-2">{category.name}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>

          {/* Subcategory pills */}
          {category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-[#8B1A4A] border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">
              No products in this category yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Check back soon or browse our full collection.
            </p>
            <Link
              href="/shop"
              className="bg-[#8B1A4A] text-white px-6 py-3 rounded-full font-bold hover:bg-[#72123b] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
