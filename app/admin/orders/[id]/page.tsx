import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatusTimeline from "@/components/store/StatusTimeline";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "bg-gray-100 text-gray-700",
  PAYMENT_VERIFICATION: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PRODUCTION: "bg-purple-100 text-purple-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { history: { orderBy: { changedAt: "asc" } } },
  });

  if (!order) notFound();

  let items: { name: string; qty: number; price: number; image?: string }[] = [];
  try {
    items = JSON.parse(order.items as string);
  } catch {
    items = [];
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#8B1A4A] mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.code}</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  ["Name", order.customerName],
                  ["Phone", order.phone],
                  ["Email", order.email || "—"],
                  ["Payment", order.paymentMethod === "QR" ? "UPI / QR" : "WhatsApp"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-gray-800 font-medium">{val}</p>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
                  <p className="text-gray-800 font-medium">
                    {order.address}, {order.city}, {order.state} — {order.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Items Ordered</h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <span className="font-bold text-gray-800 text-sm shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Payment Screenshot */}
            {order.paymentScreenshot && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">Payment Screenshot</h2>
                <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                  <img
                    src={order.paymentScreenshot}
                    alt="Payment screenshot"
                    className="max-h-80 rounded-xl border border-gray-100 hover:opacity-90 transition-opacity"
                  />
                </a>
                <p className="text-xs text-gray-400 mt-2">Click image to view full size</p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Status Updater */}
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Order Timeline</h2>
              <StatusTimeline
                currentStatus={order.status}
                history={order.history.map((h) => ({ status: h.status, changedAt: h.changedAt.toISOString() }))}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
