"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";

interface HeroImage {
  id: string;
  url: string;
  order: number;
}

export default function HeroImageEditor({ images }: { images: HeroImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "shaishaarts/hero");
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error();
      const { url } = await uploadRes.json();

      const createRes = await fetch("/api/admin/hero-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error);
      }
      toast.success("Hero image added!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/hero-images/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "");
      }
      toast.success("Image removed.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Couldn't remove the image. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSwap = async (idxA: number, idxB: number) => {
    const a = images[idxA];
    const b = images[idxB];
    setBusyId(a.id);
    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/admin/hero-images/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/admin/hero-images/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
      if (!resA.ok || !resB.ok) {
        const data = await (resA.ok ? resB : resA).json().catch(() => ({}));
        throw new Error(data.error || "");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Couldn't reorder the images. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={img.id} className="relative group">
            <img
              src={img.url}
              alt={`Hero slot ${idx + 1}`}
              className="w-full aspect-square object-cover rounded-xl border border-gray-100"
            />
            <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Slot {idx + 1}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              disabled={busyId === img.id}
              className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-60"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => handleSwap(idx, idx - 1)}
                disabled={idx === 0 || busyId !== null}
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-30 shadow-sm"
                title="Move earlier"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleSwap(idx, idx + 1)}
                disabled={idx === images.length - 1 || busyId !== null}
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-30 shadow-sm"
                title="Move later"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {images.length < 4 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#8B1A4A] hover:text-[#8B1A4A] transition-colors text-xs gap-1.5 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            {uploading ? "Uploading" : "Add Image"}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Up to 4 images. If fewer than 4 are set, the homepage falls back to default placeholder photos for the remaining slots. Max 5 MB per image.
      </p>
    </div>
  );
}
