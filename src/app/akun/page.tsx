import { Metadata } from "next";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = {
  title: "Akun Pelanggan - PASARLORE",
  description: "Masuk atau daftar akun PASARLORE untuk memantau status pesanan dan kemudahan belanja.",
};

export default function AccountPage() {
  return <AccountClient />;
}
