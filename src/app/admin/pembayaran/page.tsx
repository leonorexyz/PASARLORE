import { Metadata } from "next";
import { PaymentSettingsAdminClient } from "./PaymentSettingsAdminClient";

export const metadata: Metadata = {
  title: "Pengaturan Pembayaran - Admin PASARLORE",
  description: "Kelola daftar rekening bank transfer manual toko PASARLORE.",
};

export default function AdminPaymentSettingsPage() {
  return <PaymentSettingsAdminClient />;
}
