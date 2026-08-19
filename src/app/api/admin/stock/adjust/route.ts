import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, stockMovements } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, sku, change, reason } = body;

    if (!productId || change === undefined) {
      return NextResponse.json(
        { success: false, error: "ID produk dan jumlah perubahan harus disertakan." },
        { status: 400 }
      );
    }

    const prod = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (prod.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    const numChange = Number(change);
    const newStock = Math.max(0, prod[0].stock + numChange);

    // 1. Update product stock
    await db
      .update(products)
      .set({ stock: newStock })
      .where(eq(products.id, productId));

    // 2. Insert stock movement log
    const movementId = `sm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await db.insert(stockMovements).values({
      id: movementId,
      productId,
      change: numChange,
      reason: reason || (numChange > 0 ? "Penambahan Stok Manual" : "Pengurangan Stok Manual"),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Stok berhasil diperbarui menjadi ${newStock} unit.`,
      newStock,
      movementId,
    });
  } catch (error) {
    console.error("Adjust stock API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyesuaikan stok produk" },
      { status: 500 }
    );
  }
}
