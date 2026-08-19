import React, { Suspense } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ProductGrid } from "@/components/products/ProductGrid";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";

function CatalogSection({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-500">
          Memuat katalog PASARLORE...
        </div>
      }
    >
      <CatalogContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CatalogContent({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialCategory = resolvedParams.category || "semua";
  const initialSearch = resolvedParams.search || "";

  return (
    <ProductGrid
      products={MOCK_PRODUCTS}
      categories={MOCK_CATEGORIES}
      initialCategory={initialCategory}
      initialSearch={initialSearch}
    />
  );
}

export default function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <FeatureCards />
      <CatalogSection searchParams={searchParams} />
    </div>
  );
}
