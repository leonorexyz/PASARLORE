"use client";

import React, { useState, useMemo } from "react";
import { Product, Category } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Search,
  ArrowUpDown,
  X,
  PackageSearch,
} from "lucide-react";

import { CategoryFilter } from "@/components/products/CategoryFilter";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}

export function ProductGrid({
  products,
  categories,
  initialCategory = "semua",
  initialSearch = "",
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "semua") {
          const categoryObj = categories.find((c) => c.slug === selectedCategory);
          if (categoryObj && product.categoryId !== categoryObj.id) {
            return false;
          }
        }

        // Search query filter (matches name, description, or SKU)
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesSku = product.sku.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesSku) {
            return false;
          }
        }

        // In-stock only filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "stock-desc":
            return b.stock - a.stock;
          case "sold-desc":
            return (b.soldCount ?? 0) - (a.soldCount ?? 0);
          case "rating-desc":
            return (b.rating ?? 0) - (a.rating ?? 0);
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0; // default featured order
        }
      });
  }, [products, categories, selectedCategory, searchQuery, sortBy, onlyInStock]);

  return (
    <section id="catalog" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-1">
              Katalog Lengkap PASARLORE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Produk Serba Ada
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Jelajahi elektronik, perlengkapan rumah tangga, fashion, makanan & minuman berkualitas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-bold bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              Menampilkan{" "}
              <strong className="text-amber-700">{filteredProducts.length}</strong>{" "}
              dari {products.length} produk
            </span>
          </div>
        </div>

        {/* Category Pills Slider */}
        <CategoryFilter
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search, Filter & Sort Bar */}
        <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box in catalog */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Cari nama barang atau SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters and Sort */}
          <div className="flex flex-wrap items-center justify-end w-full md:w-auto gap-3">
            {/* Stock filter toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 hover:bg-amber-50/50 transition-colors">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 w-3.5 h-3.5 accent-amber-500"
              />
              <span>Stok Tersedia Saja</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
              >
                <option value="featured">Rekomendasi</option>
                <option value="sold-desc">Terlaris</option>
                <option value="rating-desc">Rating Tertinggi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="stock-desc">Stok Terbanyak</option>
                <option value="newest">Produk Terbaru</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tidak ada produk yang cocok
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan
                produk yang Anda inginkan.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("semua");
                  setSearchQuery("");
                  setOnlyInStock(false);
                }}
                className="mt-5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
