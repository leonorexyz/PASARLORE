import React, { Suspense } from "react";
import { Metadata } from "next";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { CatalogClient } from "./CatalogClient";

export const metadata: Metadata = {
  title: "Katalog Produk Segar — Sayur, Buah & Daging Pilihan",
  description:
    "Jelajahi seluruh pilihan sayuran organik, buah manis, daging segar, dan sembako berkualitas dengan harga terbaik di PASARLORE.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialCategory = resolvedParams.category || "semua";
  const initialSearch = resolvedParams.search || "";

  const products = (await fetchProducts()) || MOCK_PRODUCTS;
  const categories = (await fetchCategories()) || MOCK_CATEGORIES;

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-500">
          Memuat katalog PASARLORE...
        </div>
      }
    >
      <CatalogClient
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialSearch={initialSearch}
      />
    </Suspense>
  );
}
