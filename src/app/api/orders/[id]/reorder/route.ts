import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, carts, cartItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { addToUserCart } from "@/db/cart";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || "user-1";

    // 1. Get order
    const dbOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (dbOrder.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // 2. Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Item pesanan kosong." },
        { status: 400 }
      );
    }

    // 3. Add each item to cart
    for (const item of items) {
      await addToUserCart(userId, item.productId, item.quantity);
    }

    return NextResponse.json({
      success: true,
      message: `${items.length} item dari pesanan berhasil dimasukkan kembali ke keranjang.`,
    });
  } catch (error) {
    console.error("Reorder API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses beli ulang" },
      { status: 500 }
    );
  }
}
