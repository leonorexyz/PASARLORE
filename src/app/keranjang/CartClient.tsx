"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/mock-data";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/OptimizedImage";

export function CartClient() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // Free shipping threshold: Rp 150.000
  const freeShippingThreshold = 150000;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  // Shipping calculation
  const shippingFee = isFreeShipping || items.length === 0 ? 0 : 15000;
  const discountAmount = Math.round((totalPrice * discountPercent) / 100);
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "PASARLORE10" || code === "DISKON10") {
      setDiscountPercent(10);
      setPromoMessage({ text: "Kupon diskon 10% berhasil diterapkan!", isSuccess: true });
    } else if (code === "HEMAT20" || code === "PASARLORE20") {
      setDiscountPercent(20);
      setPromoMessage({ text: "Kupon diskon 20% berhasil diterapkan!", isSuccess: true });
    } else if (code === "") {
      setPromoMessage(null);
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: "Kode promo tidak valid atau telah kadaluarsa.", isSuccess: false });
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Keranjang Belanja Masih Kosong
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Anda belum menambahkan produk ke dalam keranjang belanja. Yuk, jelajahi ribuan produk serba ada di PASARLORE!
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/25 transition-all text-sm"
            >
              <span>Mulai Belanja Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center w-full py-3 px-6 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 text-sm transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/katalog" className="hover:text-amber-600 transition-colors">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Keranjang Belanja ({totalItems})</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Keranjang Belanja Anda
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Periksa item belanjaan Anda sebelum melanjutkan ke formulir pengiriman & pembayaran.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Keranjang</span>
          </button>
        </div>

        {/* Free Shipping Progress Notification */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <div className="flex items-center gap-1.5 text-amber-900">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>
                {isFreeShipping
                  ? "🎉 Selamat! Anda Mendapatkan Gratis Ongkir!"
                  : `Tambah ${formatRupiah(remainingForFreeShipping)} lagi untuk Gratis Ongkir!`}
              </span>
            </div>
            <span className="text-amber-700">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Main Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {items.map((item) => {
                const isMax = item.quantity >= item.product.stock;
                const isMin = item.quantity <= 1;
                const itemSubtotal = item.product.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Item Thumbnail & Details */}
                    <div className="flex items-start gap-4 min-w-0">
                      <Link
                        href={`/produk/${item.product.id}`}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 block"
                      >
                        <OptimizedImage
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.product.sku}
                        </span>

                        <Link
                          href={`/produk/${item.product.id}`}
                          className="block font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors truncate mt-1"
                        >
                          {item.product.name}
                        </Link>

                        <div className="text-xs text-slate-500 mt-0.5">
                          Harga: {formatRupiah(item.product.price)} / {item.product.unit}
                        </div>

                        <div className="text-[11px] text-amber-700 font-semibold mt-1">
                          Stok tersedia: {item.product.stock} {item.product.unit}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Counter */}
                      <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={isMin}
                          className="p-1 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={isMax}
                          className="p-1 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-[10px] text-slate-400">Subtotal</div>
                        <div className="text-sm font-black text-slate-900">
                          {formatRupiah(itemSubtotal)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus barang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Catalog button */}
            <div className="pt-2">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tambah Produk Lainnya</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Code Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Punya Kode Promo / Voucher?</span>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: PASARLORE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Terapkan
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`mt-2.5 text-[11px] font-semibold ${
                    promoMessage.isSuccess ? "text-amber-700 font-bold" : "text-rose-600"
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Ringkasan Pembayaran
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Harga ({totalItems} barang)</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(totalPrice)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Ongkos Kirim</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-amber-700 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Diskon Voucher ({discountPercent}%)</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <div className="text-xs font-bold text-slate-900">Total Tagihan</div>
                  <div className="text-[10px] text-slate-400">Termasuk pajak & layanan</div>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {formatRupiah(finalTotal)}
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/25 hover:shadow-amber-400/35 transition-all text-sm flex items-center justify-center gap-2 group"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Guarantees */}
            <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Transaksi Terlindungi & Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Jaminan Garansi Retur jika Rusak</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
