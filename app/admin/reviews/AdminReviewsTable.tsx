"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import StarRating from "@/components/store/StarRating";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date | string;
  product: { name: string; slug: string };
}

type Filter = "all" | "pending" | "approved";

export default function AdminReviewsTable({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = reviews.filter((r) =>
    filter === "pending" ? !r.isApproved :
    filter === "approved" ? r.isApproved :
    true
  );

  const approve = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isApproved: true } : r));
      toast.success("Review approved and published.");
    } catch {
      toast.error("Failed to approve review.");
    } finally {
      setLoading(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setLoading(null);
    }
  };

  const tabs: { label: string; value: Filter }[] = [
    { label: `All (${reviews.length})`, value: "all" },
    { label: `Pending (${reviews.filter((r) => !r.isApproved).length})`, value: "pending" },
    { label: `Approved (${reviews.filter((r) => r.isApproved).length})`, value: "approved" },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === t.value
                ? "bg-[#8B1A4A] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-rose-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          No reviews found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Rating</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Comment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[120px]">
                    <span className="truncate block">{review.product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{review.customerName}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={review.rating} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[240px]">
                    <p className="line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      review.isApproved
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => approve(review.id)}
                          disabled={loading === review.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => remove(review.id)}
                        disabled={loading === review.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
