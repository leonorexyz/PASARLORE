"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { RealtimeSearchBar } from "@/components/products/RealtimeSearchBar";
import { formatRupiah } from "@/lib/mock-data";
import {
  Grid2X2,
  List,
  ArrowUpDown,
  PackageSearch,
  ChevronRight,
  Filter,
} from "lucide-react";

interface CatalogClientProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}

export function CatalogClient({
  products,
  categories,
  initialCategory = "semua",
  initialSearch = "",
}: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  // Filtered and sorted products
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

        // Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesSku = product.sku.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesSku) {
            return false;
          }
        }

        // Stock filter
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        // Price filter
        if (product.price > maxPrice) {
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
            return 0;
        }
      });
  }, [products, categories, selectedCategory, searchQuery, sortBy, onlyInStock, maxPrice]);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Katalog Lengkap</span>
        </nav>

        {/* Page Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 rounded-3xl shadow-lg border border-amber-500/20">
          <div>
            <span className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              PASARLORE Department Store
            </span>
            <h1 className="text-3xl font-extrabold mt-2">Semua Katalog Produk</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Jelajahi berbagai pilihan elektronik, kebutuhan rumah tangga harian, makanan & minuman, fashion, hingga kecantikan dengan harga terbaik.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-amber-400/20 text-center shrink-0">
            <div className="text-2xl font-black text-amber-400">
              {filteredProducts.length}
            </div>
            <div className="text-xs text-slate-300">Produk Tersedia</div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Filter className="w-4 h-4 text-amber-500" />
                  <span>Filter Produk</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("semua");
                    setSearchQuery("");
                    setOnlyInStock(false);
                    setMaxPrice(500000);
                  }}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800"
                >
                  Reset
                </button>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Kategori
                </label>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? "bg-amber-100 text-amber-950 font-bold border border-amber-300"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {c.slug === "semua"
                          ? products.length
                          : products.filter((p) => p.categoryId === c.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Maks. Harga
                  </label>
                  <span className="text-xs font-black text-slate-900">
                    {formatRupiah(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={10000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Rp 10.000</span>
                  <span>Rp 500.000</span>
                </div>
              </div>

              {/* Stock filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Hanya Stok Tersedia</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Search, Toolbar & Responsive Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="w-full sm:w-80">
                <RealtimeSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  totalResults={filteredProducts.length}
                  placeholder="Cari produk atau SKU..."
                />
              </div>

              {/* Controls (Sort & View Switcher) */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Rekomendasi</option>
                    <option value="sold-desc">Terlaris</option>
                    <option value="rating-desc">Rating Tertinggi</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="price-desc">Harga Tertinggi</option>
                    <option value="stock-desc">Stok Terbanyak</option>
                    <option value="newest">Terbaru</option>
                  </select>
                </div>

                {/* View switcher buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-amber-600 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Tampilan Grid"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-amber-600 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Tampilan List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category pills for mobile */}
            <div className="lg:hidden">
              <CategoryFilter
                categories={categories}
                products={products}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Product Display */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Tidak Ada Produk Ditemukan
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau geser filter batas harga.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("semua");
                    setSearchQuery("");
                    setOnlyInStock(false);
                    setMaxPrice(500000);
                  }}
                  className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
