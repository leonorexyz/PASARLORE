import { Metadata } from "next";
import { StockManagementClient } from "./StockManagementClient";

export const metadata: Metadata = {
  title: "Manajemen Stok & Mutasi - Admin PASARLORE",
  description: "Kelola kuantitas stok per SKU dan pantau riwayat mutasi barang di toko PASARLORE.",
};

export default function AdminStockPage() {
  return <StockManagementClient />;
}
