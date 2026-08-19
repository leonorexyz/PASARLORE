import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products, addresses, users, payments, paymentMethods } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try finding order in DB
    const foundOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        userName: users.name,
        userEmail: users.email,
        addressId: orders.addressId,
        recipientName: addresses.recipientName,
        phone: addresses.phone,
        addressText: addresses.address,
        city: addresses.city,
        postalCode: addresses.postalCode,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(addresses, eq(orders.addressId, addresses.id))
      .where(or(eq(orders.id, id), eq(orders.orderNumber, id)))
      .limit(1);

    if (foundOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const orderData = foundOrders[0];

    // Fetch order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderData.id));

    // Fetch payments
    const paymentList = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderData.id))
      .limit(1);

    const payment = paymentList.length > 0 ? paymentList[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        createdAt: orderData.createdAt,
        customer: {
          id: orderData.userId,
          name: orderData.userName || orderData.recipientName || "Pelanggan",
          email: orderData.userEmail,
        },
        shippingAddress: {
          recipientName: orderData.recipientName,
          phone: orderData.phone,
          address: orderData.addressText,
          city: orderData.city,
          postalCode: orderData.postalCode,
        },
        items,
        payment,
      },
    });
  } catch (error) {
    console.error("Single order API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail pesanan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status baru harus disertakan." },
        { status: 400 }
      );
    }

    await db
      .update(orders)
      .set({ status })
      .where(or(eq(orders.id, id), eq(orders.orderNumber, id)));

    return NextResponse.json({
      success: true,
      message: `Status pesanan berhasil diperbarui menjadi '${status}'.`,
      status,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status pesanan" },
      { status: 500 }
    );
  }
}
