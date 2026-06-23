"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";

interface ReviewActionsProps {
  reviewId: string;
  isApproved: boolean;
  onUpdate: () => void;
}

export default function ReviewActions({ reviewId, isApproved, onUpdate }: ReviewActionsProps) {
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Review approved.");
      onUpdate();
    } catch {
      toast.error("Failed to approve review.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this review?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Review deleted.");
      onUpdate();
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isApproved && (
        <button
          onClick={approve}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" /> Approve
        </button>
      )}
      <button
        onClick={remove}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}
