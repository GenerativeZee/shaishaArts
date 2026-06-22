import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, sort, search } = await searchParams;

  const whereClause: Record<string, unknown> = { isActive: true };

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      include: { children: true },
    });
    if (cat) {
      const ids = [cat.id, ...cat.children.map((c) => c.id)];
      whereClause.categoryId = { in: ids };
    }
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { category: { select: { name: true, slug: true } } },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Header */}
      <section className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
            Collections
          </span>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mt-3">Shop All Products</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <ShopFilters categories={categories} />
        </Suspense>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
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
