"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string; // JSON array string
    stock: number;
    isBestseller: boolean;
    isFeatured: boolean;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Parse images JSON safely
  let imagesList: string[] = ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500"];
  try {
    if (product.images) {
      imagesList = JSON.parse(product.images);
    }
  } catch {
    // fallback
  }

  const primaryImage = imagesList[0] || "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500";
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
      slug: product.slug,
    });

    toast.success(`${product.name} added to cart! 🌸`, {
      description: "You can view your cart or proceed to checkout.",
      duration: 3000,
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-rose-100/80 hover:border-rose-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestseller && (
          <span className="bg-rose-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Bestseller
          </span>
        )}
        {product.isFeatured && !product.isBestseller && (
          <span className="bg-[#8B1A4A] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Featured
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Out Of Stock
          </span>
        )}
      </div>

      {/* Product Image Gallery Wrapper */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden bg-rose-50/20 aspect-square shrink-0">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay icons */}
        <div className="absolute inset-0 bg-[#8B1A4A]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <div className="p-3 bg-white text-[#8B1A4A] hover:bg-[#8B1A4A] hover:text-white rounded-full shadow-md transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/category/${product.category.slug}`} className="text-[11px] font-bold text-rose-500 uppercase tracking-widest hover:underline mb-1">
          {product.category.name}
        </Link>
        <Link href={`/product/${product.slug}`} className="block group-hover:text-[#8B1A4A] transition-colors mb-2">
          <h3 className="font-serif text-base font-bold text-gray-800 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Pricing and Action row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-rose-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Price</span>
            <span className="text-lg font-bold text-[#8B1A4A] mt-1">₹{product.price}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="sm"
            className={`rounded-full shadow-sm flex gap-1.5 font-bold transition-all ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed hover:bg-gray-100"
                : "bg-white hover:bg-[#8B1A4A] text-[#8B1A4A] hover:text-white border border-rose-200 hover:border-[#8B1A4A]"
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
