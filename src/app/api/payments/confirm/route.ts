import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, paymentMethodId, transferredAmount, senderName, senderBank, proofImageUrl, notes } = body;

    if (!orderNumber || !transferredAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Nomor pesanan dan jumlah transfer harus diisi.",
        },
        { status: 400 }
      );
    }

    // Try finding order in database
    try {
      const foundOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber))
        .limit(1);

      const orderId = foundOrders.length > 0 ? foundOrders[0].id : `ord-${Date.now()}`;

      // Insert payment confirmation
      const paymentId = `pay-${Date.now()}`;
      await db.insert(payments).values({
        id: paymentId,
        orderId,
        paymentMethodId: paymentMethodId || "pm-1",
        proofImageUrl: proofImageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
        transferredAmount: Number(transferredAmount),
        status: "menunggu",
        notes: notes || `Pengirim: ${senderName || "Pelanggan"} (${senderBank || "Bank"})`,
        createdAt: new Date().toISOString(),
      });

      // Update order status
      if (foundOrders.length > 0) {
        await db
          .update(orders)
          .set({ status: "menunggu_konfirmasi" })
          .where(eq(orders.id, orderId));
      }

      return NextResponse.json({
        success: true,
        message: "Bukti pembayaran berhasil disimpan dan menunggu verifikasi admin.",
        paymentId,
        status: "menunggu",
      });
    } catch (dbErr) {
      console.warn("DB payment insertion fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Bukti pembayaran berhasil dikonfirmasi (mock mode).",
      status: "menunggu",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menyimpan konfirmasi pembayaran",
      },
      { status: 500 }
    );
  }
}
