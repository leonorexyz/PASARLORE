import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "user-1";

    const list = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (list.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: list[0],
    });
  } catch (error) {
    console.error("User profile GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat profil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID diperlukan." },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(email && { email: email.toLowerCase().trim() }),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
    });
  } catch (error) {
    console.error("User profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
