import { NextRequest, NextResponse } from "next/server";
import { getUserCart, addToUserCart, clearUserCart } from "@/db/cart";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-cust-1";

    const cart = await getUserCart(userId);
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat keranjang" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = "usr-cust-1", productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "ID produk harus disertakan." },
        { status: 400 }
      );
    }

    // Check product stock
    const prod = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (prod.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    if (prod[0].stock <= 0) {
      return NextResponse.json(
        { success: false, error: "Stok produk ini sedang habis." },
        { status: 400 }
      );
    }

    const res = await addToUserCart(userId, productId, Number(quantity));

    return NextResponse.json({
      success: true,
      message: "Produk berhasil ditambahkan ke keranjang.",
      data: res,
    });
  } catch (error) {
    console.error("Add to cart API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan produk ke keranjang" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, userId, productId, quantity } = body;

    if (quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Kuantitas baru harus disertakan." },
        { status: 400 }
      );
    }

    const newQty = Number(quantity);

    // If quantity is 0 or negative, remove the item
    if (newQty <= 0) {
      if (itemId) {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));
      } else if (userId && productId) {
        const cart = await getUserCart(userId);
        if (cart) {
          await db
            .delete(cartItems)
            .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
        }
      }
      return NextResponse.json({
        success: true,
        message: "Item berhasil dihapus dari keranjang.",
      });
    }

    // Update quantity
    if (itemId) {
      await db
        .update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, itemId));
    } else if (userId && productId) {
      const cart = await getUserCart(userId);
      if (cart) {
        await db
          .update(cartItems)
          .set({ quantity: newQty })
          .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
      }
    }

    return NextResponse.json({
      success: true,
      message: "Jumlah item keranjang berhasil diperbarui.",
      quantity: newQty,
    });
  } catch (error) {
    console.error("Patch cart error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengubah jumlah item keranjang" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-cust-1";
    const itemId = searchParams.get("itemId");
    const productId = searchParams.get("productId");

    if (itemId) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else if (productId) {
      const cart = await getUserCart(userId);
      if (cart) {
        await db
          .delete(cartItems)
          .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)));
      }
    } else {
      await clearUserCart(userId);
    }

    return NextResponse.json({
      success: true,
      message: "Keranjang berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus item dari keranjang" },
      { status: 500 }
    );
  }
}
