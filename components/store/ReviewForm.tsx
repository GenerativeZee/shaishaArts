"use client";

import { useState } from "react";
import { toast } from "sonner";
import StarRating from "./StarRating";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    if (!name.trim()) { toast.error("Please enter your name."); return; }
    if (!comment.trim()) { toast.error("Please write a comment."); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🌸</div>
        <p className="font-serif font-bold text-gray-800">Thank you for your review!</p>
        <p className="text-gray-500 text-sm mt-1">It will appear on the site once approved.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} size="lg" interactive onRate={setRating} />
          {rating > 0 && (
            <span className="text-sm text-gray-500 font-medium">{ratingLabels[rating]}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          maxLength={80}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
