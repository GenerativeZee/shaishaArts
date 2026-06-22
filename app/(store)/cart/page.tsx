"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQty, removeFromCart, cartTotal, clearCart, isLoaded } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            Looks like you haven't added anything yet. Explore our beautiful collections!
          </p>
          <Link
            href="/shop"
            className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 transition-colors"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF5F8]">
      <section className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-4xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 flex gap-4 items-start"
              >
                <Link href={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-rose-50"
                  />
                </Link>
                <div className="flex flex-col flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-serif font-bold text-gray-800 hover:text-[#8B1A4A] line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <span className="text-[#8B1A4A] font-bold text-lg mt-0.5">
                    ₹{item.price}
                  </span>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-rose-100 rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 transition-colors text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      Subtotal:{" "}
                      <span className="text-gray-700 font-bold">₹{item.price * item.qty}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-300 hover:text-rose-500 transition-colors p-1 shrink-0"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-rose-500 transition-colors underline"
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sticky top-28">
              <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4 border-b border-rose-50 pb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-gray-600">
                    <span className="truncate flex-1 mr-2">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold text-gray-800 shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center font-bold text-gray-900 text-lg mb-6">
                <span>Total</span>
                <span className="text-[#8B1A4A]">₹{cartTotal}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-[#8B1A4A] hover:bg-[#72123b] text-white py-3 rounded-full font-bold shadow-md flex items-center gap-2 justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link
                href="/shop"
                className="block text-center text-sm text-gray-400 hover:text-[#8B1A4A] mt-3"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
