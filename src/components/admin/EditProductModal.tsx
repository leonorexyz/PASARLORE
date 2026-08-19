"use client";

import React, { useState, useEffect } from "react";
import { Category, Product } from "@/types";
import { X, Edit2, Sparkles, AlertCircle, Check } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onProductUpdated: () => void;
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onProductUpdated,
}: EditProductModalProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("unit");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [skuStatus, setSkuStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSku(product.sku || "");
      setCategoryId(product.categoryId || categories[0]?.id || "");
      setPrice(product.price?.toString() || "");
      setStock(product.stock?.toString() || "0");
      setUnit(product.unit || "unit");
      setImageUrl(product.imageUrl || "");
      setDescription(product.description || "");
      setIsFeatured(Boolean(product.isFeatured));
      setSkuStatus({ checking: false, available: true, message: "SKU saat ini." });
    }
  }, [product, categories]);

  if (!isOpen || !product) return null;

  const validateSkuUniqueness = async (skuInput: string) => {
    const cleanSku = skuInput.trim().toUpperCase();
    if (!cleanSku || cleanSku.length < 3) {
      setSkuStatus({ checking: false, available: null, message: "" });
      return;
    }

    if (cleanSku === product.sku.toUpperCase()) {
      setSkuStatus({ checking: false, available: true, message: "SKU saat ini untuk produk ini." });
      return;
    }

    setSkuStatus({ checking: true, available: null, message: "Memeriksa keunikan SKU..." });

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(cleanSku)}`);
      const data = await res.json();

      if (data?.data && Array.isArray(data.data)) {
        const duplicate = data.data.some(
          (p: any) => p.sku?.toUpperCase() === cleanSku && p.id !== product.id
        );

        if (duplicate) {
          setSkuStatus({
            checking: false,
            available: false,
            message: `SKU '${cleanSku}' sudah dipakai produk lain!`,
          });
        } else {
          setSkuStatus({
            checking: false,
            available: true,
            message: `SKU '${cleanSku}' unik & dapat digunakan.`,
          });
        }
      } else {
        setSkuStatus({ checking: false, available: true, message: `SKU '${cleanSku}' unik & dapat digunakan.` });
      }
    } catch {
      setSkuStatus({ checking: false, available: true, message: "SKU siap digunakan." });
    }
  };

  const handleSkuChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    setSku(clean);
    validateSkuUniqueness(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !sku || !price) {
      setErrorMsg("Nama, SKU unik, dan harga wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku: sku.toUpperCase().trim(),
          categoryId,
          price: Number(price),
          stock: Number(stock),
          unit,
          imageUrl,
          description,
          isFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui produk");
      }

      onProductUpdated();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memperbarui produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
              Edit Informasi SKU
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Perbarui Produk
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SKU Unik *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => handleSkuChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 uppercase ${
                  skuStatus.available === true
                    ? "border-emerald-500 focus:ring-emerald-400 bg-emerald-50/20"
                    : skuStatus.available === false
                    ? "border-rose-500 focus:ring-rose-400 bg-rose-50/20"
                    : "border-slate-200 focus:ring-amber-400 focus:bg-white"
                }`}
              />

              {skuStatus.message && (
                <div
                  className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                    skuStatus.available === true
                      ? "text-emerald-600"
                      : skuStatus.available === false
                      ? "text-rose-600"
                      : "text-slate-400"
                  }`}
                >
                  {skuStatus.available === true && <Check className="w-3 h-3" />}
                  {skuStatus.available === false && <AlertCircle className="w-3 h-3" />}
                  <span>{skuStatus.message}</span>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                required
                min="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stok Produk
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL Foto Produk
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-xs font-semibold text-slate-700">
              Tampilkan sebagai Produk Unggulan di Beranda
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || skuStatus.available === false}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-400/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
