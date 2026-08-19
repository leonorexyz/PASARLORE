import { Metadata } from "next";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard - PASARLORE",
  description: "Panel kendali toko online dan manajemen stok PASARLORE.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
