"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { buildOrderMessage } from "@/lib/whatsapp";
import { Copy, Check, Upload, MessageCircle, Loader2 } from "lucide-react";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "shaishaarts@upi";
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "ShaishaArts";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

interface OrderData {
  code: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentScreenshot?: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const { code } = useParams<{ code: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"qr" | "whatsapp">("qr");
  const [upiCopied, setUpiCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/orders/${code}`)
      .then((r) => r.json())
      .then((data) => {
        let items = data.items;
        if (typeof items === "string") {
          try { items = JSON.parse(items); } catch { items = []; }
        }
        setOrder({ ...data, items });
        if (data.paymentMethod === "WHATSAPP") setTab("whatsapp");
        if (data.paymentScreenshot) setScreenshotUrl(data.paymentScreenshot);
      })
      .catch(() => toast.error("Failed to load order details."))
      .finally(() => setLoading(false));
  }, [code]);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("orderCode", code);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setScreenshotUrl(url);
      toast.success("Payment screenshot uploaded! We'll verify and confirm your order. 🌸");
    } catch {
      toast.error("Upload failed. Please try again or contact us on WhatsApp.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B1A4A] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">Order not found</h2>
          <a href="/shop" className="text-[#8B1A4A] font-bold hover:underline text-sm">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  const waLink = buildOrderMessage({ code: order.code, items: order.items, total: order.totalAmount });

  return (
    <div className="w-full bg-[#FFF5F8] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Confirmation Header */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="text-gray-500 text-sm mt-2">
            Your order <span className="font-bold text-[#8B1A4A]">#{order.code}</span> has been
            received. Please complete payment below.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 mb-6">
          <h2 className="font-serif font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 border-b border-rose-50 pb-4 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-700">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg">
            <span>Total to Pay</span>
            <span className="text-[#8B1A4A]">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden mb-6">
          {/* Tabs */}
          <div className="flex border-b border-rose-100">
            <button
              onClick={() => setTab("qr")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                tab === "qr"
                  ? "bg-rose-50 text-[#8B1A4A] border-b-2 border-[#8B1A4A]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              📱 UPI / QR Payment
            </button>
            <button
              onClick={() => setTab("whatsapp")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                tab === "whatsapp"
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              💬 WhatsApp Order
            </button>
          </div>

          <div className="p-6">
            {tab === "qr" && (
              <div className="flex flex-col items-center gap-5">
                <p className="text-sm text-gray-600 text-center">
                  Scan the QR code below with any UPI app (GPay, PhonePe, Paytm) and pay{" "}
                  <span className="font-bold text-[#8B1A4A]">₹{order.totalAmount}</span>
                </p>

                <img
                  src="/upi-qr.png"
                  alt="UPI QR Code"
                  className="w-48 h-48 rounded-2xl border border-rose-200 shadow-sm object-contain bg-white p-1"
                />

                {/* UPI ID */}
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#8B1A4A]">
                  <span>{UPI_ID}</span>
                  <button onClick={copyUpi} className="ml-2 text-gray-500 hover:text-[#8B1A4A]">
                    {upiCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">UPI Name: {UPI_NAME}</p>

                {/* Screenshot Upload */}
                {screenshotUrl ? (
                  <div className="text-center">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-2">
                      <Check className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-emerald-700">Screenshot uploaded!</p>
                      <p className="text-xs text-gray-500 mt-1">
                        We&apos;ll verify and confirm your order within 24 hours.
                      </p>
                    </div>
                    <img
                      src={screenshotUrl}
                      alt="Payment screenshot"
                      className="max-h-40 rounded-xl border border-rose-100 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-sm text-gray-500 mb-3">
                      After payment, upload your payment screenshot here:
                    </p>
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-rose-200 rounded-xl p-6 hover:bg-rose-50 transition-colors text-[#8B1A4A] font-bold text-sm flex flex-col items-center gap-2 disabled:opacity-60"
                    >
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                      {uploading ? "Uploading..." : "Upload Payment Screenshot"}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}

            {tab === "whatsapp" && (
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="text-4xl">💬</div>
                <div>
                  <h3 className="font-serif font-bold text-gray-800 text-lg mb-2">
                    Send Your Order on WhatsApp
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Click below to open WhatsApp with your order details pre-filled. Attach your
                    payment screenshot in the same chat.
                  </p>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold shadow-md flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Open WhatsApp
                </a>
                <p className="text-xs text-gray-400">
                  Your order ID is <span className="font-bold text-gray-600">{order.code}</span>. Keep
                  it handy to track your order.
                </p>

                {/* Also allow screenshot upload for WA orders */}
                {!screenshotUrl ? (
                  <div className="w-full mt-2">
                    <p className="text-xs text-gray-400 mb-2">
                      Or upload payment screenshot here too:
                    </p>
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-emerald-200 rounded-xl p-4 hover:bg-emerald-50 transition-colors text-emerald-700 font-bold text-sm flex items-center gap-2 justify-center disabled:opacity-60"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload Screenshot
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center w-full">
                    <p className="text-sm font-bold text-emerald-700">Screenshot uploaded! ✓</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
          <p className="font-bold mb-1">⚠️ Important</p>
          <p>
            Your order will be confirmed only after we verify your payment. This usually takes up
            to 24 hours. You can track your order status using your Order ID{" "}
            <span className="font-bold">{order.code}</span> and your phone number.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`/track-order`}
            className="flex-1 bg-white hover:bg-rose-50 text-[#8B1A4A] border border-rose-200 px-6 py-3 rounded-full font-bold text-center transition-colors"
          >
            Track Order
          </a>
          <a
            href="/shop"
            className="flex-1 bg-[#8B1A4A] hover:bg-[#72123b] text-white px-6 py-3 rounded-full font-bold text-center transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
