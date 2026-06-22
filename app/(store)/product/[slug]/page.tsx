import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import ProductActions from "@/components/store/ProductActions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) notFound();

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [];
  }
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600"];
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: { category: { select: { name: true, slug: true } } },
    take: 4,
  });

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="w-full bg-[#FFF5F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/shop" className="hover:text-[#8B1A4A] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Shop
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-[#8B1A4A]">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-10">
          {/* Image Gallery */}
          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              description: product.description,
              materials: product.materials,
              careInstructions: product.careInstructions,
              images,
              category: { name: product.category.name, slug: product.category.slug },
            }}
          />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
