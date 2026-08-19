import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products, stockMovements, addresses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      postalCode,
      items,
      totalAmount,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Daftar barang pesanan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Ensure user exists
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = `usr-${Date.now()}`;
      try {
        await db.insert(users).values({
          id: effectiveUserId,
          name: customerName || "Pelanggan",
          email: customerEmail || `cust-${Date.now()}@pasarlore.com`,
          role: "customer",
          createdAt: new Date().toISOString(),
        }).onConflictDoNothing();
      } catch (uErr) {
        console.warn("User insert warning:", uErr);
      }
    }

    // 2. Insert address if provided
    let addressId: string | null = null;
    if (address && city) {
      addressId = `addr-${Date.now()}`;
      try {
        await db.insert(addresses).values({
          id: addressId,
          userId: effectiveUserId,
          label: "Alamat Pengiriman",
          recipientName: customerName || "Pelanggan",
          phone: customerPhone || "-",
          address,
          city,
          postalCode: postalCode || "00000",
          createdAt: new Date().toISOString(),
        });
      } catch (aErr) {
        console.warn("Address insert warning:", aErr);
      }
    }

    // 3. Insert order
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId: effectiveUserId,
      addressId,
      totalAmount: Number(totalAmount),
      status: "menunggu_pembayaran",
      createdAt: new Date().toISOString(),
    });

    // 4. Insert order items & reduce product stocks
    for (const item of items) {
      const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const subtotal = Number(item.price) * Number(item.quantity);

      await db.insert(orderItems).values({
        id: orderItemId,
        orderId,
        productId: item.productId,
        productName: item.productName || item.product?.name || "Produk",
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal,
      });

      // Update product inventory stock
      try {
        const prod = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (prod.length > 0) {
          const newStock = Math.max(0, prod[0].stock - Number(item.quantity));
          await db
            .update(products)
            .set({
              stock: newStock,
              soldCount: (prod[0].soldCount ?? 0) + Number(item.quantity),
            })
            .where(eq(products.id, item.productId));

          // Log stock movement
          await db.insert(stockMovements).values({
            id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            productId: item.productId,
            change: -Number(item.quantity),
            reason: `Pemesanan #${orderNumber}`,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (stockErr) {
        console.warn("Stock update error:", stockErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      totalAmount,
      status: "menunggu_pembayaran",
      message: "Pesanan berhasil dibuat.",
    });
  } catch (error) {
    console.error("Order creation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal membuat pesanan",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = db.select().from(orders).orderBy(desc(orders.createdAt));

    const result = await query;
    return NextResponse.json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar pesanan" },
      { status: 500 }
    );
  }
}
