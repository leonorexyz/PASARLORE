import { Metadata } from "next";
import { ProductListAdminClient } from "./ProductListAdminClient";

export const metadata: Metadata = {
  title: "Katalog & SKU Produk - Admin PASARLORE",
  description: "Daftar produk, SKU unik, dan pengelolaan inventaris toko PASARLORE.",
};

export default function AdminProductsPage() {
  return <ProductListAdminClient />;
}
