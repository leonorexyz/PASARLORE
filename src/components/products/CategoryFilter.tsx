"use client";

import React from "react";
import { Category, Product } from "@/types";
import {
  Smartphone,
  Home,
  Coffee,
  Shirt,
  Sparkles,
  ShoppingBag,
  LayoutGrid,
  Check,
} from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  variant?: "pills" | "grid";
}

export function CategoryFilter({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  variant = "pills",
}: CategoryFilterProps) {
  const getCategoryIcon = (slug: string, isSelected: boolean) => {
    const iconClass = isSelected ? "text-slate-950 font-bold" : "text-amber-600";
    switch (slug) {
      case "elektronik-gadget":
        return <Smartphone className={`w-4 h-4 ${iconClass}`} />;
      case "kebutuhan-rumah-tangga":
        return <Home className={`w-4 h-4 ${iconClass}`} />;
      case "makanan-minuman":
        return <Coffee className={`w-4 h-4 ${iconClass}`} />;
      case "fashion-aksesoris":
        return <Shirt className={`w-4 h-4 ${iconClass}`} />;
      case "kesehatan-kecantikan":
        return <Sparkles className={`w-4 h-4 ${iconClass}`} />;
      default:
        return <LayoutGrid className={`w-4 h-4 ${iconClass}`} />;
    }
  };

  // Helper to count products per category
  const getProductCount = (categorySlug: string) => {
    if (categorySlug === "semua") return products.length;
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) return 0;
    return products.filter((p) => p.categoryId === cat.id).length;
  };

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = getProductCount(cat.slug);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? "bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-400/25 font-bold"
                  : "bg-white border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/40 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-white/40" : "bg-amber-50"
                  }`}
                >
                  {getCategoryIcon(cat.slug, isSelected)}
                </div>
                {isSelected && <Check className="w-4 h-4 text-slate-950" />}
              </div>

              <div>
                <div className="font-bold text-xs leading-snug">{cat.name}</div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {count} produk
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = getProductCount(cat.slug);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                isSelected
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/25 scale-[1.02] font-black"
                  : "bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs hover:scale-[1.01]"
              }`}
            >
              {getCategoryIcon(cat.slug, isSelected)}
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] transition-colors ${
                  isSelected
                    ? "bg-slate-950/15 text-slate-950 font-black"
                    : "bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {selectedCategory !== "semua" && (
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500">Kategori aktif:</span>
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
            <span>{categories.find((c) => c.slug === selectedCategory)?.name}</span>
            <button
              onClick={() => onSelectCategory("semua")}
              className="p-0.5 hover:bg-amber-200 rounded-full transition-colors ml-1"
              title="Hapus filter kategori"
            >
              <Check className="w-3 h-3 rotate-45 text-slate-700" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
