"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  materials?: string | null;
  careInstructions?: string | null;
  images: string[];
  category: { name: string; slug: string };
}

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      },
      qty
    );
    setAdded(true);
    toast.success(`${product.name} added to cart! 🌸`);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <>
      {/* Images Column */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100">
          <img
            src={product.images[activeImg]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((p) => (p === 0 ? product.images.length - 1 : p - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImg((p) => (p === product.images.length - 1 ? 0 : p + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === activeImg ? "border-[#8B1A4A] shadow-md" : "border-rose-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Column */}
      <div className="flex flex-col">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">
          {product.category.name}
        </span>
        <h1 className="font-serif text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

        {/* Stock badge */}
        <div className="mt-3">
          {isOutOfStock ? (
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
              ✓ In Stock ({product.stock} available)
            </span>
          )}
        </div>

        <div className="text-3xl font-bold text-[#8B1A4A] mt-4">₹{product.price}</div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mt-4">{product.description}</p>

        {/* Materials */}
        {product.materials && (
          <div className="mt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Materials</h4>
            <p className="text-sm text-gray-600">{product.materials}</p>
          </div>
        )}

        {/* Care */}
        {product.careInstructions && (
          <div className="mt-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Care Instructions</h4>
            <p className="text-sm text-gray-600">{product.careInstructions}</p>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="mt-8 flex flex-col gap-4">
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center border border-rose-100 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-gray-800">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-3.5 rounded-full font-bold text-base shadow-md flex items-center gap-2 justify-center transition-all ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-[#8B1A4A] hover:bg-[#72123b] text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Assurance row */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-500 font-medium">
          <span>🌸 Handmade with love</span>
          <span>🇮🇳 Pan India shipping</span>
          <span>✨ Premium quality</span>
        </div>
      </div>
    </>
  );
}
