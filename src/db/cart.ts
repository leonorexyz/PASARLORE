import { db } from "./index";
import { carts, cartItems, products } from "./schema";
import { eq, and } from "drizzle-orm";

export async function getUserCart(userId: string) {
  try {
    let userCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (userCart.length === 0) {
      const newCartId = `cart-${Date.now()}`;
      await db.insert(carts).values({
        id: newCartId,
        userId,
        createdAt: new Date().toISOString(),
      });
      return { id: newCartId, userId, items: [] };
    }

    const cart = userCart[0];
    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        productName: products.name,
        productPrice: products.price,
        productStock: products.stock,
        productImageUrl: products.imageUrl,
        productSku: products.sku,
        productUnit: products.unit,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    return {
      ...cart,
      items,
    };
  } catch (error) {
    console.error("getUserCart error:", error);
    return null;
  }
}

export async function addToUserCart(userId: string, productId: string, quantity: number = 1) {
  const cart = await getUserCart(userId);
  if (!cart) throw new Error("Gagal mengambil keranjang pengguna");

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)))
    .limit(1);

  if (existingItem.length > 0) {
    const newQty = existingItem[0].quantity + quantity;
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existingItem[0].id));
    return { id: existingItem[0].id, quantity: newQty };
  } else {
    const newItemId = `ci-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await db.insert(cartItems).values({
      id: newItemId,
      cartId: cart.id,
      productId,
      quantity,
    });
    return { id: newItemId, quantity };
  }
}

export async function clearUserCart(userId: string) {
  const cart = await getUserCart(userId);
  if (!cart) return;

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
}
