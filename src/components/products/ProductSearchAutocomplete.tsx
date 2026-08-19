"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { MOCK_PRODUCTS, formatRupiah } from "@/lib/mock-data";
import { Search, X, TrendingUp, Package, ChevronRight, Tag } from "lucide-react";

interface ProductSearchAutocompleteProps {
  placeholder?: string;
  onSearchSelect?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function ProductSearchAutocomplete({
  placeholder = "Cari elektronik, kebutuhan rumah tangga, fashion, atau SKU...",
  onSearchSelect,
  className = "",
  autoFocus = false,
}: ProductSearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Popular search suggestions
  const popularKeywords = [
    "TWS Earbuds Pro",
    "Powerbank 20000mAh",
    "Deterjen Cair",
    "Kopi Arabika",
    "Kaos Polos",
    "Sunscreen Gel",
    "SKU-ELK-001",
  ];

  // Filtered live results
  const matchingProducts = query.trim()
    ? MOCK_PRODUCTS.filter((product) => {
        const q = query.toLowerCase().trim();
        return (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearchSelect) {
        onSearchSelect(query.trim());
      } else {
        router.push(`/katalog?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    setIsOpen(false);
    if (onSearchSelect) {
      onSearchSelect(keyword);
    } else {
      router.push(`/katalog?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
            title="Hapus"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-full text-xs shadow-xs transition-colors flex items-center gap-1"
        >
          Cari
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
          {/* Live Product Results */}
          {query.trim() !== "" ? (
            <div>
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Hasil untuk &quot;<strong>{query}</strong>&quot;</span>
                <span className="font-semibold text-amber-700">{matchingProducts.length} produk ditemukan</span>
              </div>

              {matchingProducts.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {matchingProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/produk/${p.id}`}
                      onClick={() => setIsOpen(false)}
                      className="p-3 hover:bg-amber-50/60 flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 truncate">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                              {p.sku}
                            </span>
                            <span>•</span>
                            <span>Stok: {p.stock}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900">
                          {formatRupiah(p.price)}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform inline" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ditemukan produk dengan kata kunci &quot;{query}&quot;.
                </div>
              )}

              {/* View all in catalog footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  Lihat Semua Hasil di Katalog &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* Popular Searches Suggestions when input is empty */
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Pencarian Populer di PASARLORE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleSelectKeyword(kw)}
                    className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-200 font-medium"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
