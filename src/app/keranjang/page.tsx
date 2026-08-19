import { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description: "Lihat dan kelola daftar barang belanjaan Anda di PASARLORE.",
};

export default function CartPage() {
  return <CartClient />;
}
