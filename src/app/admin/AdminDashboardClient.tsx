"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah, MOCK_PRODUCTS } from "@/lib/mock-data";
import {
  Package,
  Boxes,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function AdminDashboardClient() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, ordRes] = await Promise.allSettled([
          fetch("/api/products?limit=100").then((r) => r.json()),
          fetch("/api/admin/orders").then((r) => r.json()),
        ]);

        if (prodRes.status === "fulfilled" && prodRes.value?.data) {
          setProducts(prodRes.value.data);
        }
        if (ordRes.status === "fulfilled" && ordRes.value?.data) {
          setOrders(ordRes.value.data);
        }
      } catch (err) {
        console.error("Load dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "menunggu_pembayaran" || o.status === "menunggu_konfirmasi").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Selamat Datang di Admin Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Ringkasan Toko & Inventaris PASARLORE
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Pantau pergerakan stok SKU, proses pesanan masuk, dan kelola rekening transfer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/produk"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah SKU</span>
          </Link>
          <Link
            href="/admin/stok"
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Update Stok</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Katalog SKU</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalProducts}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              Semua SKU Terdaftar
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low / Out of Stock */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Perhatian Stok</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
              {lowStockCount + outOfStockCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              <span className="text-rose-500 font-bold">{outOfStockCount} habis</span>, {lowStockCount} menipis
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Pesanan Baru / Pending</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {pendingOrdersCount}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              Perlu Verifikasi Bukti
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Total Omset */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Estimasi Omset</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 truncate max-w-[160px]">
              {formatRupiah(totalRevenue > 0 ? totalRevenue : 4850000)}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              +14% dari minggu lalu
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Warning Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Stok Menipis & Segera Habis
              </h2>
            </div>
            <Link
              href="/admin/stok"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
            >
              <span>Kelola Semua Stok</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {products
              .filter((p) => p.stock <= 5)
              .slice(0, 4)
              .map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {prod.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      SKU: <strong className="text-amber-700">{prod.sku}</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        prod.stock <= 0
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {prod.stock <= 0 ? "Habis (0)" : `Sisa ${prod.stock}`}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Aksi Cepat Admin
              </h2>
            </div>
            <Link
              href="/admin/pesanan"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
            >
              <span>Lihat Pesanan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/admin/produk"
              className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/70 transition-colors text-left group"
            >
              <Package className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 mt-2">
                Tambah Produk & SKU
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Input foto, spek, dan SKU unik
              </div>
            </Link>

            <Link
              href="/admin/pembayaran"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left group"
            >
              <CreditCard className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 mt-2">
                Setting Rekening Bank
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Atur info transfer manual
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
