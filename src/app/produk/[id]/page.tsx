import React from "react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { fetchProductById, fetchProducts } from "@/lib/api";
import { ProductDetailClient } from "./ProductDetailClient";
import { PackageSearch, ArrowLeft } from "lucide-react";

import { Metadata } from "next";
import { formatRupiah } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await fetchProductById(id)) || MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: `${product.name} (${product.sku}) — ${formatRupiah(product.price)}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — PASARLORE`,
      description: `${product.description.slice(0, 150)}... Beli sekarang hanya ${formatRupiah(product.price)} di PASARLORE.`,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch product from API / service layer
  const product = (await fetchProductById(id)) || MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Produk yang Anda cari tidak tersedia atau telah dihapus dari katalog PASARLORE.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Produk</span>
          </Link>
        </div>
      </div>
    );
  }

  const allProducts = await fetchProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
