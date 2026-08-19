import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, stockMovements } from "@/db/schema";
import { eq, like, or, and, gte, lte, desc, asc } from "drizzle-orm";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const inStockOnly = searchParams.get("inStock") === "true";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const offset = (page - 1) * limit;

    try {
      let query = db
        .select({
          id: products.id,
          sku: products.sku,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          stock: products.stock,
          categoryId: products.categoryId,
          imageUrl: products.imageUrl,
          isActive: products.isActive,
          unit: products.unit,
          soldCount: products.soldCount,
          createdAt: products.createdAt,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id));

      const conditions = [];

      if (categoryParam && categoryParam !== "semua" && categoryParam !== "all") {
        conditions.push(
          or(
            eq(products.categoryId, categoryParam),
            eq(categories.slug, categoryParam)
          )
        );
      }

      if (searchParam && searchParam.trim()) {
        const term = `%${searchParam.trim().toLowerCase()}%`;
        conditions.push(
          or(
            like(products.name, term),
            like(products.description, term),
            like(products.sku, term)
          )
        );
      }

      if (inStockOnly) {
        conditions.push(gte(products.stock, 1));
      }

      if (minPrice !== undefined) {
        conditions.push(gte(products.price, minPrice));
      }

      if (maxPrice !== undefined) {
        conditions.push(lte(products.price, maxPrice));
      }

      let dbProducts = [];
      if (conditions.length > 0) {
        dbProducts = await query.where(and(...conditions));
      } else {
        dbProducts = await query;
      }

      if (dbProducts.length > 0) {
        switch (sortBy) {
          case "price-asc":
            dbProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            dbProducts.sort((a, b) => b.price - a.price);
            break;
          case "sold-desc":
            dbProducts.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
            break;
          case "newest":
            dbProducts.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          default:
            break;
        }

        const totalItems = dbProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedProducts = dbProducts.slice(offset, offset + limit);

        const enriched = paginatedProducts.map((p) => {
          const isOutOfStock = p.stock <= 0;
          const isLowStock = p.stock > 0 && p.stock <= 5;
          return {
            ...p,
            category: {
              id: p.categoryId,
              name: p.categoryName || "Umum",
              slug: p.categorySlug || "umum",
            },
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
          total: totalItems,
          page,
          limit,
          totalPages,
          data: enriched,
        });
      }
    } catch (dbError) {
      console.warn("DB Query fallback:", dbError);
    }

    let fallback = [...MOCK_PRODUCTS];

    if (categoryParam && categoryParam !== "semua" && categoryParam !== "all") {
      fallback = fallback.filter(
        (p) => p.categoryId === categoryParam || p.category?.slug === categoryParam
      );
    }
    if (searchParam) {
      const q = searchParam.toLowerCase().trim();
      fallback = fallback.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    if (inStockOnly) {
      fallback = fallback.filter((p) => p.stock > 0);
    }

    const total = fallback.length;
    const enriched = fallback.map((p) => ({
      ...p,
      stockAvailability: {
        status: p.stock <= 0 ? "out_of_stock" : p.stock <= 5 ? "low_stock" : "in_stock",
        label: p.stock <= 0 ? "Stok Habis" : p.stock <= 5 ? `Sisa ${p.stock} unit!` : "Tersedia",
        isAvailable: p.stock > 0,
        quantity: p.stock,
      },
    }));

    return NextResponse.json({
      success: true,
      total,
      data: enriched,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat daftar produk",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, categoryId, price, stock = 0, unit = "unit", imageUrl, description } = body;

    if (!name || !sku || !price) {
      return NextResponse.json(
        { success: false, error: "Nama produk, SKU unik, dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const cleanSku = sku.toUpperCase().trim();

    // 1. Server-side SKU uniqueness validation
    const existingSku = await db
      .select()
      .from(products)
      .where(eq(products.sku, cleanSku))
      .limit(1);

    if (existingSku.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `SKU '${cleanSku}' sudah terdaftar pada sistem. Harap gunakan SKU unik lain.`,
        },
        { status: 400 }
      );
    }

    const productId = `prod-${Date.now()}`;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 2. Insert new product
    await db.insert(products).values({
      id: productId,
      sku: cleanSku,
      name,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      description: description || "",
      price: Number(price),
      stock: Number(stock),
      categoryId: categoryId || "cat-1",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
      isActive: true,
      unit: unit || "unit",
      soldCount: 0,
      createdAt: new Date().toISOString(),
    });

    // 3. Log initial stock movement if stock > 0
    if (Number(stock) > 0) {
      await db.insert(stockMovements).values({
        id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId,
        change: Number(stock),
        reason: "Stok Awal Produk Baru",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Produk dengan SKU '${cleanSku}' berhasil ditambahkan ke katalog.`,
      productId,
      sku: cleanSku,
    });
  } catch (error) {
    console.error("Create product API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal membuat produk baru",
      },
      { status: 500 }
    );
  }
}
