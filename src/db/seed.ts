import { db } from "./index";
import { categories, products, stockMovements, paymentMethods, users } from "./schema";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_PAYMENT_METHODS } from "../lib/mock-data";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Admin & Sample Customer Users
  await db.insert(users).values([
    {
      id: "usr-admin-1",
      name: "Admin PASARLORE",
      email: "admin@pasarlore.com",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr-cust-1",
      name: "Budi Santoso",
      email: "budi@gmail.com",
      role: "customer",
      createdAt: new Date().toISOString(),
    },
  ]).onConflictDoNothing();

  // 2. Seed Categories
  for (const cat of MOCK_CATEGORIES) {
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "LayoutGrid",
      description: cat.description || "",
      createdAt: new Date().toISOString(),
    }).onConflictDoNothing();
  }

  // 3. Seed Products & Initial Stock Movements
  for (const prod of MOCK_PRODUCTS) {
    await db.insert(products).values({
      id: prod.id,
      sku: prod.sku,
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      categoryId: prod.categoryId,
      imageUrl: prod.imageUrl,
      isActive: prod.isActive,
      unit: prod.unit,
      rating: prod.rating ?? 5.0,
      soldCount: prod.soldCount ?? 0,
      createdAt: prod.createdAt,
    }).onConflictDoNothing();

    // Log initial stock movement
    await db.insert(stockMovements).values({
      id: `sm-init-${prod.id}`,
      productId: prod.id,
      change: prod.stock,
      reason: "Stok Awal Produk Toko",
      createdAt: prod.createdAt,
    }).onConflictDoNothing();
  }

  // 4. Seed Payment Methods
  for (const pm of MOCK_PAYMENT_METHODS) {
    await db.insert(paymentMethods).values({
      id: pm.id,
      bankName: pm.bankName,
      accountNumber: pm.accountNumber,
      accountHolder: pm.accountHolder,
      instructions: pm.instructions,
      isActive: pm.isActive,
      createdAt: new Date().toISOString(),
    }).onConflictDoNothing();
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
