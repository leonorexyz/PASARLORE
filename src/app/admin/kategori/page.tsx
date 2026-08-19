import { Metadata } from "next";
import { CategoryManagementClient } from "./CategoryManagementClient";

export const metadata: Metadata = {
  title: "Kelola Kategori - Admin PASARLORE",
  description: "Kelola klasifikasi dan kategori barang dagangan toko PASARLORE.",
};

export default function AdminCategoriesPage() {
  return <CategoryManagementClient />;
}
