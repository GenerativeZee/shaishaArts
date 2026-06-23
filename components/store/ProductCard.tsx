"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: {
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
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const wished = isWishlisted(product.id);

  let imagesList: string[] = [];
  try {
    if (product.images) imagesList = JSON.parse(product.images);
  } catch { /* fallback */ }

  const primaryImage = imagesList[0] || "";
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      slug: product.slug,
    });

    toast.success(`${product.name} added to cart! 🌸`, {
      description: "You can view your cart or proceed to checkout.",
      duration: 2500,
    });

    setTimeout(() => setAdding(false), 1000);
  };

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (!wished) toast.success("Added to wishlist 💕");
    else toast("Removed from wishlist");
  };

  return (
    <div className="group bg-white rounded-2xl border border-rose-100/80 hover:border-rose-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative">

      {/* Badges — top-left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isBestseller && (
          <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full shadow">
            🔥 Bestseller
          </span>
        )}
        {product.isFeatured && !product.isBestseller && (
          <span className="bg-[#8B1A4A] text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full shadow">
            ⭐ Featured
          </span>
        )}
        {isLowStock && (
          <span className="bg-amber-500 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full shadow">
            Only {product.stock} left!
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-400 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full shadow">
            Out Of Stock
          </span>
        )}
      </div>

      {/* Wishlist — top-right */}
      <button
        onClick={toggleWish}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${wished ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-400"}`}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden bg-rose-50/30 aspect-square shrink-0">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${isOutOfStock ? "opacity-60 grayscale-[30%]" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-rose-50">
            <span className="text-4xl">🌸</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B1A4A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="bg-white/90 backdrop-blur-sm text-[#8B1A4A] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/50 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/category/${product.category.slug}`} className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors mb-1">
          {product.category.name}
        </Link>

        <Link href={`/product/${product.slug}`} className="block mb-1.5">
          <h3 className="font-serif text-base font-bold text-gray-800 line-clamp-1 group-hover:text-[#8B1A4A] transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.avgRating && product.avgRating > 0 ? (
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRating rating={Math.round(product.avgRating)} size="sm" />
            <span className="text-[11px] text-gray-400 font-medium">({product.reviewCount})</span>
          </div>
        ) : null}

        {product.description && (
          <p className="text-gray-400 text-xs font-medium line-clamp-2 mb-3 flex-grow leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-rose-50/80">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none mb-0.5">Price</span>
            <span className="text-xl font-extrabold text-[#8B1A4A]">₹{product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
              isOutOfStock
                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                : adding
                ? "bg-emerald-500 text-white border-emerald-500 scale-95"
                : "bg-white text-[#8B1A4A] border-rose-200 hover:bg-[#8B1A4A] hover:text-white hover:border-[#8B1A4A] hover:scale-105 active:scale-95"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {adding ? "Added!" : isOutOfStock ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
