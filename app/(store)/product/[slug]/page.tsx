import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import ProductActions from "@/components/store/ProductActions";
import StarRating from "@/components/store/StarRating";
import ReviewForm from "@/components/store/ReviewForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
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

  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

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

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {/* Rating summary */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-4 bg-white rounded-2xl border border-rose-100 p-5 mb-6">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
                <StarRating rating={Math.round(avgRating)} size="md" />
                <p className="text-xs text-gray-400 mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="h-12 w-px bg-rose-100" />
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = product.reviews.filter((r) => r.rating === star).length;
                  const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 text-right">{star}</span>
                      <span className="text-amber-400">★</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review list */}
          {product.reviews.length > 0 ? (
            <div className="space-y-4 mb-10">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-rose-100 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.customerName}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first to review this product!</p>
          )}

          {/* Review form */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6">
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            <ReviewForm productId={product.id} />
          </div>
        </section>

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
