import { Metadata } from "next";
import { PaymentConfirmationClient } from "./PaymentConfirmationClient";

export const metadata: Metadata = {
  title: "Konfirmasi Pembayaran",
  description: "Upload bukti transfer pembayaran pesanan toko PASARLORE.",
};

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <PaymentConfirmationClient orderNumber={orderNumber} />;
}
