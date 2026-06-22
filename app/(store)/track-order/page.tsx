"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StatusTimeline from "@/components/store/StatusTimeline";
import { Search, Package } from "lucide-react";

interface OrderData {
  code: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  items: { name: string; qty: number; price: number }[];
  history: { status: string; changedAt: string }[];
}

export default function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !phone.trim()) {
      toast.error("Please enter both Order ID and phone number.");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), phone: phone.trim() }),
      });
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      // parse items
      let items = data.items;
      if (typeof items === "string") {
        try { items = JSON.parse(items); } catch { items = []; }
      }
      setOrder({ ...data, items });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Header */}
      <section className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
            Order Status
          </span>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mt-4">Track Your Order</h1>
          <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm">
            Enter your Order ID (e.g. SA1001) and the mobile number used while placing the order.
          </p>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-5"></div>
        </div>
      </section>

      <section className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Track Form */}
        <form
          onSubmit={handleTrack}
          className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Order ID
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SA1001"
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B1A4A] hover:bg-[#72123b] text-white py-3 rounded-full font-bold shadow-md flex items-center gap-2 justify-center"
          >
            <Search className="w-4 h-4" />
            {loading ? "Tracking..." : "Track Order"}
          </Button>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-2">Order Not Found</h3>
            <p className="text-gray-500 text-sm">
              No order found with that ID and phone number. Please double-check your details.
            </p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="space-y-5">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-gray-800 text-xl">
                    Order #{order.code}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Payment: {order.paymentMethod === "QR" ? "UPI / QR" : "WhatsApp"}
                  </p>
                </div>
                <span className="bg-rose-100 text-[#8B1A4A] text-xs font-bold px-3 py-1.5 rounded-full">
                  ₹{order.totalAmount}
                </span>
              </div>

              <div className="border-t border-rose-50 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Items Ordered
                </h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-[#8B1A4A]" />
                <h2 className="font-serif font-bold text-gray-800 text-lg">Order Journey</h2>
              </div>
              <StatusTimeline currentStatus={order.status} history={order.history} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
