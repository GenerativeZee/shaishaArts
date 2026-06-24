"use client";

import React, { useTransition, useCallback, useRef, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: Category[];
}

const RATINGS = [
  { label: "All Ratings", value: "" },
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
  { label: "2★ & above", value: "2" },
];

const SORTS = [
  { label: "Latest", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating_desc" },
];

export default function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Controlled local state for debounced inputs so focus is never lost
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const getParam = (key: string) => searchParams.get(key) || "";

  const hasActiveFilters = !!(
    getParam("search") || getParam("category") || getParam("sort") ||
    getParam("minPrice") || getParam("maxPrice") || getParam("minRating")
  );

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }, [searchParams, pathname, router]);

  const debounce = useCallback((key: string, value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam(key, value), 400);
  }, [updateParam]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const clearAll = () => {
    setSearchValue("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.replace(pathname));
  };

  return (
    <div className="mb-8">
      {/* Top bar: Search + Filters toggle + Clear */}
      <div className="flex gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounce("search", e.target.value);
            }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
            showFilters || hasActiveFilters
              ? "border-[#8B1A4A] bg-rose-50 text-[#8B1A4A]"
              : "border-rose-100 bg-white text-gray-600 hover:border-rose-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="bg-white border border-rose-100 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              value={getParam("category")}
              onChange={(e) => updateParam("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range (₹)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  debounce("minPrice", e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <span className="text-gray-400 text-xs font-bold shrink-0">to</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  debounce("maxPrice", e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Min Rating</label>
            <select
              value={getParam("minRating")}
              onChange={(e) => updateParam("minRating", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {RATINGS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={getParam("sort")}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {getParam("search") && (
            <Chip label={`"${getParam("search")}"`} onRemove={() => { setSearchValue(""); updateParam("search", ""); }} />
          )}
          {getParam("category") && (
            <Chip label={categories.find(c => c.slug === getParam("category"))?.name || getParam("category")} onRemove={() => updateParam("category", "")} />
          )}
          {getParam("minPrice") && (
            <Chip label={`Min ₹${getParam("minPrice")}`} onRemove={() => { setMinPrice(""); updateParam("minPrice", ""); }} />
          )}
          {getParam("maxPrice") && (
            <Chip label={`Max ₹${getParam("maxPrice")}`} onRemove={() => { setMaxPrice(""); updateParam("maxPrice", ""); }} />
          )}
          {getParam("minRating") && (
            <Chip label={`${getParam("minRating")}★ & above`} onRemove={() => updateParam("minRating", "")} />
          )}
          {getParam("sort") && (
            <Chip label={SORTS.find(s => s.value === getParam("sort"))?.label || ""} onRemove={() => updateParam("sort", "")} />
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-[#8B1A4A] text-xs font-semibold px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-rose-700"><X className="w-3 h-3" /></button>
    </span>
  );
}
