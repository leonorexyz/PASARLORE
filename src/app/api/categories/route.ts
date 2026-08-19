import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export async function GET() {
  try {
    try {
      const dbCategories = await db.select().from(categories);
      if (dbCategories.length > 0) {
        return NextResponse.json({
          success: true,
          data: dbCategories,
        });
      }
    } catch (dbError) {
      console.warn("DB Categories query failed, falling back:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: MOCK_CATEGORIES,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat kategori",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama kategori wajib diisi." },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newId = `cat-${Date.now()}`;

    await db.insert(categories).values({
      id: newId,
      name,
      slug: cleanSlug,
      description: description || "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan.",
      id: newId,
    });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "ID dan nama kategori wajib diisi." },
        { status: 400 }
      );
    }

    await db
      .update(categories)
      .set({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description || "",
      })
      .where(eq(categories.id, id));

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori" },
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
        { success: false, error: "ID kategori diperlukan." },
        { status: 400 }
      );
    }

    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
