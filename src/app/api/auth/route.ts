import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name, password, role = "customer" } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email wajib diisi." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    if (action === "register") {
      // Check existing
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, emailLower))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { success: false, error: "Email sudah terdaftar. Silakan login." },
          { status: 400 }
        );
      }

      const id = `usr-${Date.now()}`;
      await db.insert(users).values({
        id,
        name: name || "Pelanggan PASARLORE",
        email: emailLower,
        passwordHash: password || "plain_pwd",
        role: role as "admin" | "customer",
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Pendaftaran berhasil.",
        user: { id, name: name || "Pelanggan PASARLORE", email: emailLower, role },
      });
    }

    // Default: Login
    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (found.length > 0) {
      const u = found[0];
      return NextResponse.json({
        success: true,
        message: "Login berhasil.",
        user: { id: u.id, name: u.name, email: u.email, role: u.role },
      });
    }

    // Auto-create customer if not existing for convenience
    const newId = `usr-${Date.now()}`;
    await db.insert(users).values({
      id: newId,
      name: name || emailLower.split("@")[0],
      email: emailLower,
      role: "customer",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Akun baru berhasil dibuat dan login.",
      user: { id: newId, name: name || emailLower.split("@")[0], email: emailLower, role: "customer" },
    });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses autentikasi" },
      { status: 500 }
    );
  }
}
