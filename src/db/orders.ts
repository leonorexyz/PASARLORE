import { db } from "./index";
import { orders, orderItems, products, stockMovements, users, addresses } from "./schema";
import { eq, desc } from "drizzle-orm";

export interface CreateOrderItemInput {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  addressId?: string;
  totalAmount: number;
  items: CreateOrderItemInput[];
}

export async function createOrder(input: CreateOrderInput) {
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // 1. Insert order
  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    userId: input.userId,
    addressId: input.addressId || null,
    totalAmount: input.totalAmount,
    status: "menunggu_pembayaran",
    createdAt: new Date().toISOString(),
  });

  // 2. Insert order items & reduce product stock
  for (const item of input.items) {
    const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const subtotal = item.price * item.quantity;

    await db.insert(orderItems).values({
      id: orderItemId,
      orderId,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      subtotal,
    });

    // Reduce stock and log stock movement
    try {
      const prod = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (prod.length > 0) {
        const newStock = Math.max(0, prod[0].stock - item.quantity);
        await db
          .update(products)
          .set({
            stock: newStock,
            soldCount: (prod[0].soldCount ?? 0) + item.quantity,
          })
          .where(eq(products.id, item.productId));

        await db.insert(stockMovements).values({
          id: `sm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId: item.productId,
          change: -item.quantity,
          reason: `Pembelian Pesanan #${orderNumber}`,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (stockErr) {
      console.warn("Stock update warning:", stockErr);
    }
  }

  return {
    orderId,
    orderNumber,
    totalAmount: input.totalAmount,
    status: "menunggu_pembayaran",
  };
}

export async function getOrderWithItems(orderNumberOrId: string) {
  try {
    const foundOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumberOrId))
      .limit(1);

    if (foundOrders.length === 0) {
      // Try by ID
      const byId = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderNumberOrId))
        .limit(1);
      if (byId.length === 0) return null;
      foundOrders.push(byId[0]);
    }

    const order = foundOrders[0];
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return {
      ...order,
      items,
    };
  } catch (err) {
    console.error("getOrderWithItems error:", err);
    return null;
  }
}
