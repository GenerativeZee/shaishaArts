"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
  orderId: string;
  orderCode: string;
}

export default function DeleteOrderButton({ orderId, orderCode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete order");
        return;
      }
      toast.success(`Order #${orderCode} deleted`);
      router.push("/admin/orders");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-800 mb-1">Delete Order</h2>
      <p className="text-xs text-gray-500 mb-4">
        Permanently removes this order and its timeline. This cannot be undone.
      </p>
      {confirming ? (
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Yes, delete
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Delete this order
        </button>
      )}
    </div>
  );
}
