import React from "react";
import { AlertCircle, Flame, CheckCircle } from "lucide-react";

interface StockStatusBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function StockStatusBadge({
  stock,
  lowStockThreshold = 10,
  size = "md",
  showCount = true,
  className = "",
}: StockStatusBadgeProps) {
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= lowStockThreshold;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (isOutOfStock) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg bg-rose-600/90 backdrop-blur-xs text-white shadow-xs font-bold ${sizeClasses[size]} ${className}`}
      >
        <AlertCircle className={iconSizes[size]} />
        <span>Stok Habis</span>
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg bg-amber-400 text-slate-950 font-black shadow-xs animate-pulse ${sizeClasses[size]} ${className}`}
      >
        <Flame className={iconSizes[size]} />
        <span>{showCount ? `Sisa ${stock} unit!` : "Stok Menipis!"}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold ${sizeClasses[size]} ${className}`}
    >
      <CheckCircle className={`${iconSizes[size]} text-amber-600`} />
      <span>{showCount ? `Tersedia ${stock} unit` : "Stok Tersedia"}</span>
    </span>
  );
}
