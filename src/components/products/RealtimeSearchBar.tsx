"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface RealtimeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  totalResults?: number;
  autoFocus?: boolean;
}

export function RealtimeSearchBar({
  value,
  onChange,
  placeholder = "Cari produk, brand, atau SKU...",
  className = "",
  totalResults,
  autoFocus = false,
}: RealtimeSearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  // Sync internal value if prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        onChange(internalValue);
      });
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, onChange]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={internalValue}
          autoFocus={autoFocus}
          onChange={(e) => setInternalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm transition-all"
        />

        {/* Search icon or loading spinner */}
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isPending ? (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {/* Clear & result counter */}
        <div className="absolute right-3 flex items-center gap-2">
          {internalValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {totalResults !== undefined && internalValue && (
            <span className="hidden sm:inline-block text-[11px] font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full border border-amber-200">
              {totalResults} hasil
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
