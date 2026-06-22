"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  description: string;
  materials: string;
  careInstructions: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
}

interface ProductFormProps {
  categories: Category[];
  product: ProductData | null;
}

const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200";

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    categoryId: product?.categoryId || "",
    price: product?.price?.toString() || "",
    description: product?.description || "",
    materials: product?.materials || "",
    careInstructions: product?.careInstructions || "",
    stock: product?.stock?.toString() || "0",
    isFeatured: product?.isFeatured ?? false,
    isBestseller: product?.isBestseller ?? false,
    isActive: product?.isActive ?? true,
  });
  const [images, setImages] = useState<string[]>(product?.images || []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, name: val, slug: autoSlug(val) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploadingImg(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.categoryId || !form.price || !form.description) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images };
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save product.");
        return;
      }
      toast.success(product ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main fields */}
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Basic Information</h2>

          <div>
            <label className={labelCls}>Product Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Anti-Tarnish Necklace"
              required
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>URL Slug <span className="text-red-500">*</span></label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="anti-tarnish-necklace"
                required
                className={inputCls + " font-mono text-xs"}
              />
            </div>
            <div>
              <label className={labelCls}>Category <span className="text-red-500">*</span></label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required className={inputCls}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the product..."
              required
              className={inputCls + " resize-none"}
            />
          </div>

          <div>
            <label className={labelCls}>Materials</label>
            <input name="materials" value={form.materials} onChange={handleChange} placeholder="e.g. Cotton cord, Wooden beads" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Care Instructions</label>
            <input name="careInstructions" value={form.careInstructions} onChange={handleChange} placeholder="e.g. Keep away from water" className={inputCls} />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Product Images</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">Main</span>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingImg}
              className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#8B1A4A] hover:text-[#8B1A4A] transition-colors text-xs gap-1 disabled:opacity-60"
            >
              {uploadingImg ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {uploadingImg ? "Uploading" : "Add Image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <p className="text-xs text-gray-400">First image is the main product image. Max 5 MB per image.</p>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Pricing & Stock</h2>
          <div>
            <label className={labelCls}>Price (₹) <span className="text-red-500">*</span></label>
            <input name="price" value={form.price} onChange={handleChange} type="number" min={0} placeholder="499" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stock Quantity</label>
            <input name="stock" value={form.stock} onChange={handleChange} type="number" min={0} placeholder="10" className={inputCls} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h2 className="font-bold text-gray-800 mb-2">Settings</h2>
          {[
            { name: "isActive", label: "Active (visible in store)" },
            { name: "isFeatured", label: "Featured (shown on homepage)" },
            { name: "isBestseller", label: "Bestseller badge" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={form[name as keyof typeof form] as boolean}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#8B1A4A]"
              />
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B1A4A] hover:bg-[#72123b] text-white py-3 rounded-xl font-bold shadow-md"
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
