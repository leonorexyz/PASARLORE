import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MOCK_PAYMENT_METHODS } from "@/lib/mock-data";

export async function GET() {
  try {
    try {
      const list = await db.select().from(paymentMethods);
      if (list.length > 0) {
        return NextResponse.json({
          success: true,
          total: list.length,
          data: list,
        });
      }
    } catch (dbErr) {
      console.warn("DB payment settings fetch error, fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      total: MOCK_PAYMENT_METHODS.length,
      data: MOCK_PAYMENT_METHODS,
    });
  } catch (error) {
    console.error("Payment settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan pembayaran" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bankName, accountNumber, accountHolder, instructions, isActive } = body;

    if (!bankName || !accountNumber || !accountHolder) {
      return NextResponse.json(
        { success: false, error: "Nama bank, nomor rekening, dan atas nama harus diisi." },
        { status: 400 }
      );
    }

    const id = `pm-${Date.now()}`;
    await db.insert(paymentMethods).values({
      id,
      bankName,
      accountNumber,
      accountHolder,
      instructions: instructions || "Transfer tepat sesuai nominal tagihan.",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Rekening pembayaran baru berhasil ditambahkan.",
      id,
    });
  } catch (error) {
    console.error("Payment settings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan rekening pembayaran" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, bankName, accountNumber, accountHolder, instructions, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID rekening harus disertakan." },
        { status: 400 }
      );
    }

    await db
      .update(paymentMethods)
      .set({
        ...(bankName && { bankName }),
        ...(accountNumber && { accountNumber }),
        ...(accountHolder && { accountHolder }),
        ...(instructions !== undefined && { instructions }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      })
      .where(eq(paymentMethods.id, id));

    return NextResponse.json({
      success: true,
      message: "Pengaturan rekening pembayaran berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Payment settings PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui rekening pembayaran" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID rekening harus disertakan." },
        { status: 400 }
      );
    }

    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));

    return NextResponse.json({
      success: true,
      message: "Rekening pembayaran berhasil dihapus.",
    });
  } catch (error) {
    console.error("Payment settings DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus rekening pembayaran" },
      { status: 500 }
    );
  }
}
