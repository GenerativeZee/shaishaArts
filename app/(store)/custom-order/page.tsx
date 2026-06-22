"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Package, Palette } from "lucide-react";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    type: "custom",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success("Inquiry sent! We'll get back to you soon. 🌸");
    } catch {
      toast.error("Failed to send inquiry. Please try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
            Inquiry Received!
          </h2>
          <p className="text-gray-500 mb-6">
            Thank you for reaching out! We'll review your request and get back to you within 24
            hours via WhatsApp or phone.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/shop"
              className="bg-[#8B1A4A] text-white px-6 py-3 rounded-full font-bold hover:bg-[#72123b] transition-colors"
            >
              Browse Shop
            </a>
            <a
              href="https://wa.me/919897015075"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF5F8]">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-rose-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
            Custom & Bulk
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
            Special Orders
          </h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Looking for something personalised or need items in bulk? Tell us what you have in
            mind and we'll make it happen.
          </p>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-6"></div>
        </div>
      </section>

      {/* Type Selector Cards */}
      <section className="pt-16 pb-4 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <button
            onClick={() => setForm((p) => ({ ...p, type: "custom" }))}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              form.type === "custom"
                ? "border-[#8B1A4A] bg-rose-50 shadow-md"
                : "border-rose-100 bg-white hover:border-rose-200"
            }`}
          >
            <Palette className={`w-7 h-7 mb-3 ${form.type === "custom" ? "text-[#8B1A4A]" : "text-gray-400"}`} />
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">Custom Order</h3>
            <p className="text-sm text-gray-500">
              Personalised design, custom colors, or a unique piece just for you.
            </p>
          </button>
          <button
            onClick={() => setForm((p) => ({ ...p, type: "bulk" }))}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              form.type === "bulk"
                ? "border-[#8B1A4A] bg-rose-50 shadow-md"
                : "border-rose-100 bg-white hover:border-rose-200"
            }`}
          >
            <Package className={`w-7 h-7 mb-3 ${form.type === "bulk" ? "text-[#8B1A4A]" : "text-gray-400"}`} />
            <h3 className="font-serif font-bold text-gray-800 text-lg mb-1">Bulk Order</h3>
            <p className="text-sm text-gray-500">
              Corporate gifting, weddings, events — we offer special pricing for bulk.
            </p>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 space-y-5"
        >
          <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">
            Tell Us About Your {form.type === "bulk" ? "Bulk" : "Custom"} Order
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address (optional)
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Your Request <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder={
                form.type === "bulk"
                  ? "Describe the items you need, quantity, occasion, and any special requirements..."
                  : "Describe your custom order — item type, preferred colors, any personalisation, occasion, etc..."
              }
              className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#8B1A4A] hover:bg-[#72123b] text-white px-8 py-3 rounded-full font-bold shadow-md flex items-center gap-2 flex-1 justify-center"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Inquiry"}
            </Button>
            <a
              href="https://wa.me/919897015075"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md flex items-center gap-2 flex-1 justify-center transition-colors"
            >
              WhatsApp Instead
            </a>
          </div>
        </form>
      </section>

      <div className="pb-16" />
    </div>
  );
}
