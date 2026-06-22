"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle2, XCircle, Gift } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

const lbl = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const inp = "w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-colors";

function FieldIcon({ valid, touched }: { valid: boolean; touched: boolean }) {
  if (!touched) return null;
  return valid
    ? <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
    : <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 pointer-events-none" />;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, isLoaded } = useCart();
  const [loading, setLoading] = useState(false);
  const [touched, setTouch] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    giftMessage: "",
    paymentMethod: "QR",
  });

  const phoneValid = /^\d{10}$/.test(form.phone);
  const pincodeValid = /^\d{6}$/.test(form.pincode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setTouch((p) => ({ ...p, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty."); return; }
    if (!phoneValid) { toast.error("Please enter a valid 10-digit phone number."); return; }
    if (!pincodeValid) { toast.error("Please enter a valid 6-digit pincode."); return; }

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
      if (!res.ok) { toast.error(data.error || "Failed to place order."); return; }
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
          <Link href="/shop" className="text-[#8B1A4A] font-bold hover:underline text-sm">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF5F8]">
      <section className="py-10 bg-white border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? "s" : ""} · ₹{cartTotal} total</p>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8B1A4A] text-white text-xs flex items-center justify-center font-extrabold">1</span>
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Full Name <span className="text-rose-500">*</span></label>
                    <input
                      name="customerName" value={form.customerName} onChange={handleChange}
                      placeholder="Your full name" required
                      className={`${inp} border-rose-100`}
                    />
                  </div>
                  <div>
                    <label className={lbl}>Mobile Number <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder="10-digit number" maxLength={10} required
                        className={`${inp} pr-10 ${
                          touched.phone
                            ? phoneValid ? "border-emerald-300 bg-emerald-50/30" : "border-rose-300 bg-rose-50/30"
                            : "border-rose-100"
                        }`}
                      />
                      <FieldIcon valid={phoneValid} touched={!!touched.phone} />
                    </div>
                    {touched.phone && !phoneValid && (
                      <p className="text-rose-400 text-xs mt-1">Enter a valid 10-digit number</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={lbl}>Email Address <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span></label>
                    <input
                      name="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com" type="email"
                      className={`${inp} border-rose-100`}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8B1A4A] text-white text-xs flex items-center justify-center font-extrabold">2</span>
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={lbl}>Street Address <span className="text-rose-500">*</span></label>
                    <input
                      name="address" value={form.address} onChange={handleChange}
                      placeholder="House no., Street, Area, Landmark" required
                      className={`${inp} border-rose-100`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={lbl}>City <span className="text-rose-500">*</span></label>
                      <input
                        name="city" value={form.city} onChange={handleChange}
                        placeholder="City" required
                        className={`${inp} border-rose-100`}
                      />
                    </div>
                    <div>
                      <label className={lbl}>State <span className="text-rose-500">*</span></label>
                      <select
                        name="state" value={form.state} onChange={handleChange} required
                        className={`${inp} border-rose-100 cursor-pointer`}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Pincode <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          name="pincode" value={form.pincode} onChange={handleChange}
                          placeholder="6-digit pincode" maxLength={6} required
                          className={`${inp} pr-10 ${
                            touched.pincode
                              ? pincodeValid ? "border-emerald-300 bg-emerald-50/30" : "border-rose-300 bg-rose-50/30"
                              : "border-rose-100"
                          }`}
                        />
                        <FieldIcon valid={pincodeValid} touched={!!touched.pincode} />
                      </div>
                      {touched.pincode && !pincodeValid && (
                        <p className="text-rose-400 text-xs mt-1">Enter a valid 6-digit pincode</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Message */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-1 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-400" /> Gift Message
                  <span className="text-sm font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
                </h2>
                <p className="text-xs text-gray-400 mb-4">Include a personal note — we'll hand-write it on a card 🌸</p>
                <textarea
                  name="giftMessage" value={form.giftMessage} onChange={handleChange}
                  placeholder="E.g. Happy Birthday! Wishing you all the love and happiness 💕"
                  rows={3}
                  className={`${inp} border-rose-100 resize-none`}
                  maxLength={200}
                />
                <p className="text-right text-xs text-gray-300 mt-1">{form.giftMessage.length}/200</p>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
                <h2 className="font-serif font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8B1A4A] text-white text-xs flex items-center justify-center font-extrabold">3</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === "QR" ? "border-[#8B1A4A] bg-rose-50/60 shadow-sm" : "border-rose-100 bg-white hover:border-rose-200"}`}>
                    <input type="radio" name="paymentMethod" value="QR" checked={form.paymentMethod === "QR"} onChange={handleChange} className="mt-0.5 accent-[#8B1A4A]" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">📱 UPI / QR Code</p>
                      <p className="text-xs text-gray-500 mt-0.5">Scan QR and upload payment screenshot</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === "WHATSAPP" ? "border-emerald-500 bg-emerald-50/60 shadow-sm" : "border-rose-100 bg-white hover:border-rose-200"}`}>
                    <input type="radio" name="paymentMethod" value="WHATSAPP" checked={form.paymentMethod === "WHATSAPP"} onChange={handleChange} className="mt-0.5 accent-emerald-500" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">💬 WhatsApp Order</p>
                      <p className="text-xs text-gray-500 mt-0.5">Send order details + screenshot on WhatsApp</p>
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
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-rose-50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 line-clamp-1 text-xs">{item.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-gray-800 shrink-0 text-sm">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm mb-4 border-b border-rose-50 pb-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span className="font-semibold text-gray-700">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span><span className="text-emerald-600 font-semibold">FREE 🎉</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-gray-900 text-lg mb-5">
                  <span>Total</span>
                  <span className="text-[#8B1A4A]">₹{cartTotal}</span>
                </div>

                <Button
                  type="submit" disabled={loading}
                  className="w-full bg-[#8B1A4A] hover:bg-[#72123b] text-white py-3.5 rounded-full font-bold shadow-md text-base transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? "Placing Order..." : "Place Order 🌸"}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Payment is completed on the next step
                </p>

                <div className="mt-5 pt-4 border-t border-rose-50 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-emerald-500">✓</span> Handcrafted with love
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-emerald-500">✓</span> Pan India shipping
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-emerald-500">✓</span> Secure UPI payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
