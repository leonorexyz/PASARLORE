import { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout & Pembayaran",
  description: "Selesaikan pemesanan produk PASARLORE dengan pengiriman aman dan transfer manual.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
