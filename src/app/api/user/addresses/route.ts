import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID diperlukan." },
        { status: 400 }
      );
    }

    const list = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId));

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat alamat" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, label, recipientName, phone, address, city, postalCode } = body;

    if (!userId || !recipientName || !phone || !address || !city) {
      return NextResponse.json(
        { success: false, error: "Semua kolom alamat wajib diisi." },
        { status: 400 }
      );
    }

    const id = `addr-${Date.now()}`;
    await db.insert(addresses).values({
      id,
      userId,
      label: label || "Rumah",
      recipientName,
      phone,
      address,
      city,
      postalCode: postalCode || "00000",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Alamat berhasil ditambahkan.",
      id,
    });
  } catch (error) {
    console.error("Addresses POST error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan alamat" },
      { status: 500 }
    );
  }
}
