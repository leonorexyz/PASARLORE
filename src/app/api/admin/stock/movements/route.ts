import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stockMovements, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select({
        id: stockMovements.id,
        productId: stockMovements.productId,
        productName: products.name,
        productSku: products.sku,
        change: stockMovements.change,
        reason: stockMovements.reason,
        createdAt: stockMovements.createdAt,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      total: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Stock movements error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat riwayat mutasi stok" },
      { status: 500 }
    );
  }
}
