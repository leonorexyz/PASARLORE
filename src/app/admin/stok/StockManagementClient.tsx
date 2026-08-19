"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { formatRupiah, MOCK_PRODUCTS } from "@/lib/mock-data";
import {
  Boxes,
  Search,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  History,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface StockMovementItem {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  change: number;
  reason: string;
  createdAt: string;
}

export function StockManagementClient() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [movements, setMovements] = useState<StockMovementItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "low" | "out">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<"in" | "out">("in");
  const [adjustQuantity, setAdjustQuantity] = useState("10");
  const [adjustReason, setAdjustReason] = useState("Restock Barang Masuk");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<"stock" | "history">("stock");

  const loadData = async () => {
    try {
      const [prodRes, moveRes] = await Promise.allSettled([
        fetch("/api/products?limit=100").then((r) => r.json()),
        fetch("/api/admin/stock/movements").then((r) => r.json()),
      ]);

      if (prodRes.status === "fulfilled" && prodRes.value?.data) {
        setProducts(prodRes.value.data);
      }
      if (moveRes.status === "fulfilled" && moveRes.value?.data) {
        setMovements(moveRes.value.data);
      } else {
        // Mock fallback movements
        setMovements([
          {
            id: "sm-1",
            productId: "prod-1",
            productName: "Smart LED 4K TV 50 Inch",
            productSku: "SKU-ELK-001",
            change: 15,
            reason: "Restock Awal Gudang",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: "sm-2",
            productId: "prod-1",
            productName: "Smart LED 4K TV 50 Inch",
            productSku: "SKU-ELK-001",
            change: -2,
            reason: "Pembelian Pesanan #ORD-829104",
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: "sm-3",
            productId: "prod-2",
            productName: "Air Purifier HEPA Filter H13",
            productSku: "SKU-ELK-002",
            change: 8,
            reason: "Restock Batch #2",
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const match =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "low") return match && p.stock > 0 && p.stock <= 5;
    if (selectedTab === "out") return match && p.stock <= 0;
    return match;
  });

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);
    const qty = Number(adjustQuantity);
    const change = adjustType === "in" ? qty : -qty;

    try {
      const res = await fetch("/api/admin/stock/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          sku: selectedProduct.sku,
          change,
          reason: adjustReason,
        }),
      });

      if (!res.ok) {
        // Fallback local update
        const newStock = Math.max(0, selectedProduct.stock + change);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, stock: newStock } : p
          )
        );

        setMovements((prev) => [
          {
            id: `sm-${Date.now()}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            productSku: selectedProduct.sku,
            change,
            reason: adjustReason,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        await loadData();
      }

      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">
            Inventaris & Gudang
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Manajemen Stok & Riwayat Mutasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penyesuaian kuantitas fisik SKU, pemantauan stok menipis, dan log audit mutasi.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveView("stock")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === "stock"
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tingkat Stok Saat Ini
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === "history"
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Riwayat Mutasi ({movements.length})
          </button>
        </div>
      </div>

      {activeView === "stock" ? (
        <div className="space-y-6">
          {/* Filter tabs */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSelectedTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedTab === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                onClick={() => setSelectedTab("low")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedTab === "low"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
              >
                Menipis (
                {products.filter((p) => p.stock > 0 && p.stock <= 5).length})
              </button>
              <button
                onClick={() => setSelectedTab("out")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedTab === "out"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                Habis ({products.filter((p) => p.stock <= 0).length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU atau nama barang..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Produk</th>
                    <th className="py-3.5 px-4">SKU Unik</th>
                    <th className="py-3.5 px-4">Sisa Kuantitas</th>
                    <th className="py-3.5 px-4">Status Ketersediaan</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden relative">
                            <OptimizedImage
                              src={p.imageUrl}
                              alt={p.name}
                              className="object-cover"
                              fill
                              sizes="40px"
                            />
                          </div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {p.name}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded text-[11px] border border-amber-300">
                          {p.sku}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-base font-black text-slate-900">
                          {p.stock}
                        </span>{" "}
                        <span className="text-[11px] text-slate-400">{p.unit}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            p.stock <= 0
                              ? "bg-rose-100 text-rose-700"
                              : p.stock <= 5
                              ? "bg-amber-100 text-amber-900"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {p.stock <= 0
                            ? "Stok Habis"
                            : p.stock <= 5
                            ? "Stok Menipis"
                            : "Stok Aman"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setAdjustType("in");
                            setAdjustQuantity("10");
                            setAdjustReason("Restock Barang Masuk");
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-colors"
                        >
                          <Boxes className="w-3.5 h-3.5 text-amber-600" />
                          <span>Update Stok</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              <span>Log Riwayat Perubahan Stok (Audit Mutasi)</span>
            </h2>
            <button
              onClick={loadData}
              className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Segarkan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {movements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Belum ada catatan riwayat mutasi stok.
              </div>
            ) : (
              movements.map((m) => (
                <div
                  key={m.id}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        m.change > 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {m.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {m.productName || "Produk"}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-amber-700">
                          {m.productSku || "SKU"}
                        </span>
                        <span>•</span>
                        <span>{m.reason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-black ${
                        m.change > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {m.change > 0 ? `+${m.change}` : m.change}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(m.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Adjust Stock Modal Dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px]">
                  Update Stok SKU
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedProduct.name}
                </h3>
                <div className="text-xs font-mono font-bold text-amber-700">
                  {selectedProduct.sku} (Saat ini: {selectedProduct.stock} {selectedProduct.unit})
                </div>
              </div>
            </div>

            <form onSubmit={handleAdjustStockSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdjustType("in")}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    adjustType === "in"
                      ? "bg-white text-emerald-700 shadow-2xs"
                      : "text-slate-600"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Masuk (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("out")}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    adjustType === "out"
                      ? "bg-white text-rose-700 shadow-2xs"
                      : "text-slate-600"
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Kurang Keluar (-)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Perubahan *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alasan / Keterangan Mutasi *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Restock Supplier / Koreksi Stok Opname"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-400/20 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
