"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah, MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { Product } from "@/types";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Boxes,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Layers,
} from "lucide-react";
import { StockStatusBadge } from "@/components/products/StockStatusBadge";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { AddProductModal } from "@/components/admin/AddProductModal";
import { EditProductModal } from "@/components/admin/EditProductModal";

export function ProductListAdminClient() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const reloadProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100").then((r) => r.json());
      if (res?.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/products/${deletingProduct.id}`, { method: "DELETE" });
      await reloadProducts();
      setDeletingProduct(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          fetch("/api/products?limit=100").then((r) => r.json()),
          fetch("/api/categories").then((r) => r.json()),
        ]);

        if (prodRes.status === "fulfilled" && prodRes.value?.data) {
          setProducts(prodRes.value.data);
        }
        if (catRes.status === "fulfilled" && catRes.value?.data) {
          setCategories(catRes.value.data);
        }
      } catch (err) {
        console.error("Load admin products error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "all" ||
      p.categoryId === selectedCategory ||
      p.category?.slug === selectedCategory;

    let matchStock = true;
    if (selectedStockStatus === "in_stock") matchStock = p.stock > 5;
    else if (selectedStockStatus === "low_stock")
      matchStock = p.stock > 0 && p.stock <= 5;
    else if (selectedStockStatus === "out_of_stock") matchStock = p.stock <= 0;

    return matchQuery && matchCategory && matchStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">
            Inventaris & Katalog
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Daftar Produk & SKU Unik
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total terdaftar: <strong>{products.length} produk</strong> dengan identifikasi SKU masing-masing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-3 px-5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-amber-400/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">Semua Status Stok</option>
            <option value="in_stock">Tersedia (&gt;5)</option>
            <option value="low_stock">Menipis (1-5)</option>
            <option value="out_of_stock">Habis (0)</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Produk</th>
                <th className="py-3.5 px-4">SKU Unik</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Satuan</th>
                <th className="py-3.5 px-4">Sisa Stok</th>
                <th className="py-3.5 px-4">Terjual</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada produk yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Product info with image */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden relative">
                          <OptimizedImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="object-cover"
                            fill
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU badge */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded-md text-[11px] border border-amber-300">
                        {p.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                        {p.category?.name || "Umum"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black ${
                            p.stock <= 0
                              ? "text-rose-600"
                              : p.stock <= 5
                              ? "text-amber-600"
                              : "text-slate-900"
                          }`}
                        >
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.unit}</span>
                      </div>
                    </td>

                    {/* Sold count */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {p.soldCount || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/produk/${p.id}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Lihat di Toko"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Produk & SKU"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/stok?sku=${p.sku}`}
                          className="p-1.5 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Ubah Stok"
                        >
                          <Boxes className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Counter Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> produk</span>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onProductAdded={reloadProducts}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        categories={categories}
        onProductUpdated={reloadProducts}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Produk dari Katalog?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus produk{" "}
                <strong className="text-slate-800 font-semibold">{deletingProduct.name}</strong>{" "}
                (SKU: <span className="font-mono text-amber-700 font-bold">{deletingProduct.sku}</span>)? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
