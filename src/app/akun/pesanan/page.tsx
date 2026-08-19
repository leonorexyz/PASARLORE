import { Metadata } from "next";
import { OrdersClient } from "./OrdersClient";

export const metadata: Metadata = {
  title: "Riwayat Pesanan - PASARLORE",
  description: "Daftar riwayat pesanan dan status pembayaran toko PASARLORE.",
};

export default function CustomerOrdersPage() {
  return <OrdersClient />;
}
