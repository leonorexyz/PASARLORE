import { db } from "./index";
import { products, stockMovements, categories } from "./schema";
import { eq, or, like, sql } from "drizzle-orm";
import { Product } from "@/types";

/**
 * Get product by unique SKU
 */
export async function getProductBySku(sku: string) {
  try {
    const result = await db
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
      .where(eq(products.sku, sku))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error getProductBySku:", error);
    return null;
  }
}

/**
 * Check if SKU is already in use
 */
export async function isSkuExists(sku: string, excludeId?: string): Promise<boolean> {
  try {
    const found = await db
      .select({ id: products.id, sku: products.sku })
      .from(products)
      .where(eq(products.sku, sku))
      .limit(1);

    if (found.length === 0) return false;
    if (excludeId && found[0].id === excludeId) return false;
    return true;
  } catch (error) {
    console.error("Error isSkuExists:", error);
    return false;
  }
}

/**
 * Update stock for product by SKU and log stock movement
 */
export async function updateStockBySku(
  sku: string,
  stockDelta: number,
  reason: string = "Penyesuaian Stok Toko"
) {
  const prod = await getProductBySku(sku);
  if (!prod) {
    throw new Error(`Produk dengan SKU ${sku} tidak ditemukan`);
  }

  const newStock = Math.max(0, prod.stock + stockDelta);

  await db
    .update(products)
    .set({ stock: newStock })
    .where(eq(products.sku, sku));

  // Log stock movement
  await db.insert(stockMovements).values({
    id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    productId: prod.id,
    change: stockDelta,
    reason,
    createdAt: new Date().toISOString(),
  });

  return {
    sku,
    oldStock: prod.stock,
    newStock,
    change: stockDelta,
  };
}
