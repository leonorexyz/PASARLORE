import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, stockMovements } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeRelated = searchParams.get("related") !== "false";

    try {
      const dbProduct = await db
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
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          or(
            eq(products.id, id),
            eq(products.slug, id),
            eq(products.sku, id)
          )
        )
        .limit(1);

      if (dbProduct.length > 0) {
        const p = dbProduct[0];
        const isOutOfStock = p.stock <= 0;
        const isLowStock = p.stock > 0 && p.stock <= 5;

        let related: any[] = [];
        if (includeRelated) {
          related = await db
            .select()
            .from(products)
            .where(eq(products.categoryId, p.categoryId))
            .limit(5);
          related = related.filter((item) => item.id !== p.id).slice(0, 4);
        }

        return NextResponse.json({
          success: true,
          data: {
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
            relatedProducts: related,
          },
        });
      }
    } catch (dbError) {
      console.warn("DB Single Product query failed, falling back:", dbError);
    }

    // Fallback to mock data
    const product = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id || p.sku === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Produk tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const related = includeRelated
      ? MOCK_PRODUCTS.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
      : [];

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        stockAvailability: {
          status: isOutOfStock ? "out_of_stock" : isLowStock ? "low_stock" : "in_stock",
          label: isOutOfStock ? "Stok Habis" : isLowStock ? `Sisa ${product.stock} unit!` : "Tersedia",
          isAvailable: !isOutOfStock,
          quantity: product.stock,
        },
        relatedProducts: related,
      },
    });
  } catch (error) {
    console.error("Single product API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, sku, categoryId, price, stock, unit, imageUrl, description, isFeatured } = body;

    // Check SKU duplicate on other products
    if (sku) {
      const cleanSku = sku.toUpperCase().trim();
      const existing = await db
        .select()
        .from(products)
        .where(eq(products.sku, cleanSku))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== id) {
        return NextResponse.json(
          { success: false, error: `SKU '${cleanSku}' sudah digunakan oleh produk lain.` },
          { status: 400 }
        );
      }
    }

    await db
      .update(products)
      .set({
        ...(name && { name }),
        ...(sku && { sku: sku.toUpperCase().trim() }),
        ...(categoryId && { categoryId }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(unit && { unit }),
        ...(imageUrl && { imageUrl }),
        ...(description !== undefined && { description }),
      })
      .where(eq(products.id, id));

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update product API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete product API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
