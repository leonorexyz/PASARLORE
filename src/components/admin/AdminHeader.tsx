"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, Shield, User, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-slate-900">
            Pusat Pengelolaan Toko PASARLORE
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Sistem terintegrasi SKU unik, stok otomatis, & transfer manual
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors"
        >
          <span>Toko Publik</span>
          <ExternalLink className="w-3 h-3 text-amber-600" />
        </Link>

        {/* Admin profile pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
            AD
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900">Administrator</div>
            <div className="text-[10px] text-amber-700 font-semibold">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
