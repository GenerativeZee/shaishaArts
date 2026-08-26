"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OfferData {
  active: boolean;
  emoji: string;
  title: string;
  message: string;
  code: string | null;
  discountType: string;
  discountValue: number;
  ctaText: string;
  ctaHref: string;
}

const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200";

export default function OfferEditor({ offer }: { offer: OfferData | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    active: offer?.active ?? true,
    emoji: offer?.emoji || "🎁",
    title: offer?.title || "",
    message: offer?.message || "",
    code: offer?.code || "",
    discountType: offer?.discountType || "PERCENT",
    discountValue: offer?.discountValue?.toString() || "0",
    ctaText: offer?.ctaText || "Shop the Offer",
    ctaHref: offer?.ctaHref || "/shop",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error("Title and message are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/offer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, discountValue: Number(form.discountValue) || 0 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Offer saved!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Failed to save offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-[#8B1A4A]"
          />
          <span className="text-sm text-gray-700 font-semibold">
            Show this offer on the site
          </span>
        </label>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Emoji</label>
            <input name="emoji" value={form.emoji} onChange={handleChange} className={inputCls + " text-center text-lg"} />
          </div>
          <div className="col-span-3">
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Raksha Bandhan Special"
              required
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Message <span className="text-red-500">*</span></label>
          <input
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="e.g. Flat 20% OFF on Rakhis, Candles & Gift Hampers"
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Coupon Code <span className="text-gray-400 font-normal normal-case tracking-normal">(leave blank for no discount)</span></label>
          <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. RAKHI20" className={inputCls + " font-mono"} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Discount Type</label>
            <select name="discountType" value={form.discountType} onChange={handleChange} className={inputCls}>
              <option value="PERCENT">Percentage (%)</option>
              <option value="FLAT">Flat amount (₹)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>
              Discount Value {form.discountType === "PERCENT" ? "(%)" : "(₹)"}
            </label>
            <input
              name="discountValue"
              type="number"
              min={0}
              max={form.discountType === "PERCENT" ? 100 : undefined}
              value={form.discountValue}
              onChange={handleChange}
              placeholder={form.discountType === "PERCENT" ? "e.g. 20" : "e.g. 100"}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Button Text</label>
            <input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="Shop the Offer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Button Link</label>
            <input name="ctaHref" value={form.ctaHref} onChange={handleChange} placeholder="/shop" className={inputCls} />
          </div>
        </div>

        <p className="text-xs text-gray-400">
          When a coupon code is set, customers can enter it at checkout to get this discount automatically applied to their order total.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-8 py-3 rounded-xl font-bold shadow-md disabled:opacity-60 flex items-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : "Save Offer"}
      </button>
    </form>
  );
}
