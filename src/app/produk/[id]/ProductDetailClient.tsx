"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ShoppingBag,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
} from "lucide-react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { StockStatusBadge } from "@/components/products/StockStatusBadge";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/keranjang");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Beli ${product.name} di PASARLORE!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/katalog?category=${product.categoryId}`}
            className="hover:text-amber-600 transition-colors"
          >
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left: Product Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                <OptimizedImage
                  src={product.imageUrl}
                  alt={product.name}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* SKU badge */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-lg">
                  {product.sku}
                </div>

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-rose-600 text-white font-bold text-sm px-4 py-2 rounded-xl">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              {/* Guarantees below image */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-center">
                  <Truck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Kirim Cepat</div>
                  <div className="text-[10px] text-slate-500">Aman & Terlindungi</div>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-center">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">100% Original</div>
                  <div className="text-[10px] text-slate-500">Garansi Toko</div>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-center">
                  <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-slate-800">Retur Mudah</div>
                  <div className="text-[10px] text-slate-500">Klaim Cepat</div>
                </div>
              </div>
            </div>

            {/* Right: Product Meta, Price & Purchase Action */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
                    PASARLORE Choice
                  </span>

                  <button
                    onClick={handleShare}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                    title="Bagikan produk"
                  >
                    <Share2 className="w-4 h-4" />
                    {copied && (
                      <span className="absolute -top-6 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded">
                        Link disalin!
                      </span>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-4 mt-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating ?? 4.9}</span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {product.soldCount ?? 200}+ Terjual
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-amber-900 font-semibold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                    Satuan: {product.unit}
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-5 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Harga per {product.unit}</div>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {formatRupiah(product.price)}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="text-xs text-slate-500 mb-1">Status Stok</div>
                    <StockStatusBadge stock={product.stock} size="md" showCount={true} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specs Table */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] text-slate-400">Kode SKU</div>
                    <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                      {product.sku}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] text-slate-400">Kemasan</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">
                      Original Box / Seal Pack
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] text-slate-400">Kondisi</div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">
                      100% Baru & Bersegel
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                {/* Quantity counter */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Jumlah Beli:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-1">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                        aria-label="Kurang"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrease}
                        disabled={quantity >= product.stock || isOutOfStock}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                        aria-label="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Total Harga:</div>
                      <div className="text-base font-black text-slate-900">
                        {formatRupiah(product.price * quantity)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 border ${
                      isOutOfStock
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : isAdded
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 font-black"
                        : "bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950 animate-bounce" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>+ Keranjang</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-amber-400/25 hover:shadow-amber-400/35"
                    }`}
                  >
                    <span>Beli Sekarang</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs & Reviews Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 mb-12">
          <div className="border-b border-slate-200 flex gap-6 pb-4">
            <h3 className="text-sm font-bold text-amber-600 border-b-2 border-amber-500 pb-2">
              Ulasan Pembeli (4.9 / 5.0)
            </h3>
            <h3 className="text-sm font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
              Informasi Pengiriman & Garansi
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    RS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Rina S.</div>
                    <div className="text-[10px] text-slate-400">Pembeli Terverifikasi • 2 hari lalu</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Produk sampai dengan cepat, packing bubble wrap tebal dan barang original bersegel. Sangat memuaskan belanja di PASARLORE!
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                    AH
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Ahmad H.</div>
                    <div className="text-[10px] text-slate-400">Pembeli Terverifikasi • 5 hari lalu</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Kualitas produk premium, respon toko cepat dan nomor resi pengiriman langsung diupdate. Rekomended!
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Produk Terkait Lainnya
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilihan produk terbaik dari kategori yang sama
                </p>
              </div>
              <Link
                href="/katalog"
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400">Total Harga</div>
          <div className="text-base font-black text-slate-900">
            {formatRupiah(product.price * quantity)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-4 py-2.5 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            {isAdded ? "Ditambahkan!" : "+ Keranjang"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md disabled:opacity-50"
          >
            Beli Langsung
          </button>
        </div>
      </div>
    </div>
  );
}
