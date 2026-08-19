"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check, Star } from "lucide-react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { StockStatusBadge } from "@/components/products/StockStatusBadge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image container */}
      <Link
        href={`/produk/${product.id}`}
        className="block relative aspect-4/3 bg-slate-100 overflow-hidden"
      >
        <OptimizedImage
          src={product.imageUrl}
          alt={product.name}
          priority={priority}
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <span className="bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-xs">
            {product.sku}
          </span>

          <StockStatusBadge stock={product.stock} size="sm" showCount={true} />
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Unit */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
              {product.unit}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ?? 4.8}</span>
              {product.soldCount && (
                <span className="text-slate-400 font-normal">
                  ({product.soldCount} terjual)
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/produk/${product.id}`}
            className="block font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Harga</div>
            <div className="text-base font-black text-slate-900">
              {formatRupiah(product.price)}
            </div>
            {/* Stock Level Indicator */}
            <div className="mt-1 flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isOutOfStock
                      ? "bg-rose-500 w-0"
                      : isLowStock
                      ? "bg-amber-500"
                      : "bg-amber-400"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(10, (product.stock / 50) * 100))}%`,
                  }}
                />
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  isOutOfStock
                    ? "text-rose-600"
                    : isLowStock
                    ? "text-amber-600 font-bold"
                    : "text-slate-600"
                }`}
              >
                {isOutOfStock ? "Habis" : `${product.stock} unit`}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : isAdded
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25"
                : "bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold shadow-xs hover:shadow-md hover:shadow-amber-400/20"
            }`}
            title={isOutOfStock ? "Stok habis" : "Tambah ke Keranjang"}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>Masuk</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>+ Beli</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
