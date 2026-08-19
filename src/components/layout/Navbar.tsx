"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useCart } from "@/context/CartContext";
import { ProductSearchAutocomplete } from "@/components/products/ProductSearchAutocomplete";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/katalog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white text-xs py-1.5 px-4 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-sm text-[10px] tracking-wider">
              PROMO SPESIAL
            </span>
            <span className="truncate text-slate-200">
              Belanja elektronik, kebutuhan rumah tangga & aneka produk terlengkap di PASARLORE!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-amber-300">
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-amber-200 transition-colors text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal Admin & Stok</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <Logo size="md" showTagline />
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <ProductSearchAutocomplete />
          </div>

          {/* Navigation icons / actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200"
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>Kelola Toko</span>
            </Link>

            {/* Cart link */}
            <Link
              href="/keranjang"
              className="relative p-2.5 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors flex items-center justify-center group"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full px-1.5 flex items-center justify-center ring-2 ring-white animate-pulse">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account link */}
            <Link
              href="/akun"
              className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-2 text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50/60 rounded-full border border-slate-200 transition-colors"
            >
              <User className="w-4 h-4 text-amber-500" />
              <span>Akun</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Cari elektronik, sembako, fashion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-full text-[11px] font-bold"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === "/"
                ? "bg-amber-50 text-amber-900 font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              pathname === "/katalog"
                ? "bg-amber-50 text-amber-900 font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Semua Katalog Produk
          </Link>
          <Link
            href="/keranjang"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span>Keranjang Belanja</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-black">
                {totalItems} item
              </span>
            )}
          </Link>
          <Link
            href="/akun"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Akun & Riwayat Pesanan
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-amber-950 bg-amber-100 hover:bg-amber-200"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Portal Dashboard Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
