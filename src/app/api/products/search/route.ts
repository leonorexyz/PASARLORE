import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, or, like } from "drizzle-orm";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || searchParams.get("query") || "").trim();
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const category = searchParams.get("category");

    if (!query) {
      return NextResponse.json({
        success: true,
        query: "",
        total: 0,
        suggestions: [
          "TWS Earbuds Pro",
          "Powerbank 20000mAh",
          "Deterjen Cair",
          "Kopi Arabika",
          "Kaos Polos",
          "Sunscreen Gel",
          "SKU-ELK-001",
        ],
        data: [],
      });
    }

    const qLower = query.toLowerCase();

    // Query from database
    try {
      let dbProducts = await db
        .select({
          id: products.id,
          sku: products.sku,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          stock: products.stock,
          categoryId: products.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          imageUrl: products.imageUrl,
          isActive: products.isActive,
          unit: products.unit,
          rating: products.rating,
          soldCount: products.soldCount,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id));

      if (dbProducts.length > 0) {
        // Filter by category if provided
        if (category && category !== "semua") {
          dbProducts = dbProducts.filter(
            (p) => p.categoryId === category || p.categorySlug === category
          );
        }

        // Filter and Rank by Search Relevance:
        // 1. Exact SKU match
        // 2. Name contains query
        // 3. Category contains query
        // 4. Description contains query
        const matches = dbProducts.filter((p) => {
          const skuMatch = p.sku.toLowerCase().includes(qLower);
          const nameMatch = p.name.toLowerCase().includes(qLower);
          const descMatch = p.description.toLowerCase().includes(qLower);
          const catMatch = p.categoryName?.toLowerCase().includes(qLower);
          return skuMatch || nameMatch || descMatch || catMatch;
        });

        // Sort by relevance
        matches.sort((a, b) => {
          const aSkuExact = a.sku.toLowerCase() === qLower ? 1 : 0;
          const bSkuExact = b.sku.toLowerCase() === qLower ? 1 : 0;
          if (aSkuExact !== bSkuExact) return bSkuExact - aSkuExact;

          const aNameStarts = a.name.toLowerCase().startsWith(qLower) ? 1 : 0;
          const bNameStarts = b.name.toLowerCase().startsWith(qLower) ? 1 : 0;
          if (aNameStarts !== bNameStarts) return bNameStarts - aNameStarts;

          return (b.soldCount ?? 0) - (a.soldCount ?? 0);
        });

        const paginated = matches.slice(0, limit);
        const enriched = paginated.map((p) => {
          const isOutOfStock = p.stock <= 0;
          const isLowStock = p.stock > 0 && p.stock <= 10;
          return {
            ...p,
            stockAvailability: {
              status: isOutOfStock ? "out_of_stock" : isLowStock ? "low_stock" : "in_stock",
              label: isOutOfStock ? "Stok Habis" : isLowStock ? `Sisa ${p.stock} unit!` : "Tersedia",
              isAvailable: !isOutOfStock,
              quantity: p.stock,
            },
          };
        });

        // Extract autocomplete suggestions
        const suggestions = Array.from(
          new Set(matches.map((p) => p.name).slice(0, 5))
        );

        return NextResponse.json({
          success: true,
          query,
          total: matches.length,
          suggestions,
          data: enriched,
        });
      }
    } catch (dbErr) {
      console.warn("DB search failed, fallback:", dbErr);
    }

    // Fallback search with mock data
    let fallback = MOCK_PRODUCTS.filter((p) => {
      const skuMatch = p.sku.toLowerCase().includes(qLower);
      const nameMatch = p.name.toLowerCase().includes(qLower);
      const descMatch = p.description.toLowerCase().includes(qLower);
      return skuMatch || nameMatch || descMatch;
    });

    if (category && category !== "semua") {
      fallback = fallback.filter((p) => p.categoryId === category);
    }

    const suggestions = Array.from(
      new Set(fallback.map((p) => p.name).slice(0, 5))
    );

    const enriched = fallback.slice(0, limit).map((p) => ({
      ...p,
      stockAvailability: {
        status: p.stock <= 0 ? "out_of_stock" : p.stock <= 10 ? "low_stock" : "in_stock",
        label: p.stock <= 0 ? "Stok Habis" : p.stock <= 10 ? `Sisa ${p.stock} unit!` : "Tersedia",
        isAvailable: p.stock > 0,
        quantity: p.stock,
      },
    }));

    return NextResponse.json({
      success: true,
      query,
      total: fallback.length,
      suggestions,
      data: enriched,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal melakukan pencarian produk",
      },
      { status: 500 }
    );
  }
}
