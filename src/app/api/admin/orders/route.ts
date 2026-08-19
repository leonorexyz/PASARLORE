import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, payments, paymentMethods, users, addresses } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const paymentStatusFilter = searchParams.get("paymentStatus");

    // Fetch all orders with user and payment details
    const orderList = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        customerName: users.name,
        customerEmail: users.email,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        recipientName: addresses.recipientName,
        phone: addresses.phone,
        address: addresses.address,
        city: addresses.city,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(addresses, eq(orders.addressId, addresses.id))
      .orderBy(desc(orders.createdAt));

    // Enrich each order with items and payment details
    const enrichedOrders = await Promise.all(
      orderList.map(async (ord) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, ord.id));

        const paymentList = await db
          .select({
            id: payments.id,
            orderId: payments.orderId,
            paymentMethodId: payments.paymentMethodId,
            bankName: paymentMethods.bankName,
            accountNumber: paymentMethods.accountNumber,
            proofImageUrl: payments.proofImageUrl,
            transferredAmount: payments.transferredAmount,
            status: payments.status,
            notes: payments.notes,
            createdAt: payments.createdAt,
          })
          .from(payments)
          .leftJoin(paymentMethods, eq(payments.paymentMethodId, paymentMethods.id))
          .where(eq(payments.orderId, ord.id))
          .limit(1);

        return {
          ...ord,
          items,
          payment: paymentList.length > 0 ? paymentList[0] : null,
        };
      })
    );

    let filtered = enrichedOrders;
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (paymentStatusFilter && paymentStatusFilter !== "all") {
      filtered = filtered.filter((o) => o.payment?.status === paymentStatusFilter);
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error("Admin orders API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data pesanan admin" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, paymentStatus, orderStatus, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID pesanan harus diisi." },
        { status: 400 }
      );
    }

    // Update payment proof verification status if provided
    if (paymentId && paymentStatus) {
      await db
        .update(payments)
        .set({
          status: paymentStatus as "menunggu" | "valid" | "ditolak",
          notes: adminNotes ? `Admin: ${adminNotes}` : undefined,
        })
        .where(eq(payments.id, paymentId));
    }

    // Update order status
    if (orderStatus) {
      await db
        .update(orders)
        .set({ status: orderStatus })
        .where(eq(orders.id, orderId));
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi bukti pembayaran & status pesanan berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memverifikasi bukti pembayaran" },
      { status: 500 }
    );
  }
}
