"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUSES, STATUS_LABELS, isValidTransition } from "@/lib/constants";
import { ChevronRight, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (!isValidTransition(currentStatus, newStatus)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
        return;
      }
      toast.success(`Status updated to: ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS]}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const nextStatus = ORDER_STATUSES.find((s) => isValidTransition(currentStatus, s));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-800 mb-4">Update Status</h2>
      <div className="space-y-2">
        {ORDER_STATUSES.map((status) => {
          const canTransition = isValidTransition(currentStatus, status);
          const isCurrent = status === currentStatus;
          return (
            <button
              key={status}
              onClick={() => canTransition && handleUpdate(status)}
              disabled={!canTransition || loading || isCurrent}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isCurrent
                  ? "bg-[#8B1A4A] text-white cursor-default"
                  : canTransition
                  ? "bg-gray-50 hover:bg-rose-50 hover:text-[#8B1A4A] text-gray-700 cursor-pointer"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <span>{STATUS_LABELS[status as keyof typeof STATUS_LABELS]}</span>
              {canTransition && !isCurrent && (
                loading && status === nextStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
              {isCurrent && <span className="text-xs opacity-70">Current</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
