"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/store/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  stock: number;
  isBestseller: boolean;
  isFeatured: boolean;
  description?: string;
  avgRating?: number;
  reviewCount?: number;
  category: { name: string; slug: string };
}

export default function WishlistPage() {
  const { wishlist, isLoaded } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      wishlist.map((id) =>
        fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))
      )
    )
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .finally(() => setLoading(false));
  }, [wishlist, isLoaded]);

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      {/* Page Header */}
      <section className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 rounded-full">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">My Wishlist</h1>
              {!loading && (
                <p className="text-gray-500 text-sm mt-0.5">
                  {products.length === 0
                    ? "No items saved yet"
                    : `${products.length} item${products.length !== 1 ? "s" : ""} saved`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-rose-100 animate-pulse">
                <div className="aspect-square bg-rose-50 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-rose-100 rounded w-1/3" />
                  <div className="h-4 bg-rose-100 rounded w-3/4" />
                  <div className="h-3 bg-rose-50 rounded w-full" />
                  <div className="h-8 bg-rose-100 rounded-full w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs">
              Save your favourite handcrafted pieces here to come back to them later.
            </p>
            <Link
              href="/shop"
              className="flex items-center gap-2 bg-[#8B1A4A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#72123b] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
