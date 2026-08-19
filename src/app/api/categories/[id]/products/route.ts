import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const inStockOnly = searchParams.get("inStock") === "true";
    const sort = searchParams.get("sort") || "featured";

    // 1. Try DB Query
    try {
      // Find category first
      const matchedCategory = await db
        .select()
        .from(categories)
        .where(or(eq(categories.id, id), eq(categories.slug, id)))
        .limit(1);

      const catInfo = matchedCategory.length > 0 ? matchedCategory[0] : null;

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
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          id === "semua"
            ? undefined
            : or(eq(products.categoryId, id), eq(categories.slug, id))
        );

      if (dbProducts.length > 0 || catInfo) {
        if (inStockOnly) {
          dbProducts = dbProducts.filter((p) => p.stock > 0);
        }

        // Sorting
        switch (sort) {
          case "price-asc":
            dbProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            dbProducts.sort((a, b) => b.price - a.price);
            break;
          case "stock-desc":
            dbProducts.sort((a, b) => b.stock - a.stock);
            break;
          case "sold-desc":
            dbProducts.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
            break;
          case "rating-desc":
            dbProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            break;
          case "newest":
            dbProducts.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          default:
            break;
        }

        const enriched = dbProducts.map((p) => {
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

        return NextResponse.json({
          success: true,
          category: catInfo || { id, name: id, slug: id },
          total: enriched.length,
          data: enriched,
        });
      }
    } catch (dbError) {
      console.warn("DB Category Products query failed, fallback:", dbError);
    }

    // 2. Fallback using mock data
    const cat = MOCK_CATEGORIES.find((c) => c.id === id || c.slug === id);
    let filtered = id === "semua"
      ? [...MOCK_PRODUCTS]
      : MOCK_PRODUCTS.filter((p) => p.categoryId === id || (cat && p.categoryId === cat.id));

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    const enriched = filtered.map((p) => {
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

    return NextResponse.json({
      success: true,
      category: cat || { id, name: "Kategori", slug: id },
      total: enriched.length,
      data: enriched,
    });
  } catch (error) {
    console.error("Category products API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat produk kategori",
      },
      { status: 500 }
    );
  }
}
