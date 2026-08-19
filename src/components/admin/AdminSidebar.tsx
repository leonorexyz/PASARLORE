"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  CreditCard,
  Store,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    label: "Ringkasan",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Katalog & SKU",
    href: "/admin/produk",
    icon: Package,
    badge: null,
  },
  {
    label: "Manajemen Stok",
    href: "/admin/stok",
    icon: Boxes,
    badge: "Stok",
  },
  {
    label: "Daftar Pesanan",
    href: "/admin/pesanan",
    icon: ShoppingCart,
    badge: "Bukti",
  },
  {
    label: "Rekening Transfer",
    href: "/admin/pembayaran",
    icon: CreditCard,
    badge: null,
  },
];

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-slate-800`}
      >
        {/* Header / Logo */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Logo theme="dark" size="sm" href="" />
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-400/30">
                Admin
              </span>
            </Link>
          </div>

          {/* Nav List */}
          <div className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
              Menu Utama
            </div>

            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-slate-950" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-black ${
                        isActive
                          ? "bg-slate-950 text-amber-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Lihat Toko Publik</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>
      </aside>
    </>
  );
}
