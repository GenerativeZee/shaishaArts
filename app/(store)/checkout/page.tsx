"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, isLoaded } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "QR",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order.");
        return;
      }
      clearCart();
      router.push(`/order/${data.code}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-14 h-14 text-rose-200 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <Link
            href="/shop"
            className="text-[#8B1A4A] font-bold hover:underline text-sm"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF5F8]">
      <section className="py-10 bg-white border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Checkout</h1>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Email Address (optional)
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      type="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no., Street, Area"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Pincode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === "QR"
                        ? "border-[#8B1A4A] bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="QR"
                      checked={form.paymentMethod === "QR"}
                      onChange={handleChange}
                      className="mt-0.5 accent-[#8B1A4A]"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">UPI / QR Code</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Scan QR code and upload payment screenshot
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === "WHATSAPP"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-rose-100 bg-white hover:border-rose-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="WHATSAPP"
                      checked={form.paymentMethod === "WHATSAPP"}
                      onChange={handleChange}
                      className="mt-0.5 accent-emerald-500"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">WhatsApp Order</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Send order details + screenshot on WhatsApp
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sticky top-28">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 border-b border-rose-50 pb-4 text-sm">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-rose-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-gray-800 shrink-0">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg mb-6">
                  <span>Total</span>
                  <span className="text-[#8B1A4A]">₹{cartTotal}</span>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B1A4A] hover:bg-[#72123b] text-white py-3.5 rounded-full font-bold shadow-md text-base"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  You&apos;ll complete payment on the next page
                </p>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
