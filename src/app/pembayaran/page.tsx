"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_PAYMENT_METHODS, formatRupiah } from "@/lib/mock-data";
import {
  CreditCard,
  Search,
  Building,
  CheckCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

export default function GeneralPaymentPage() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState("");
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      router.push(`/pembayaran/${encodeURIComponent(orderQuery.trim())}`);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="bg-amber-400 text-slate-950 font-black px-3.5 py-1 rounded-full text-xs uppercase tracking-wider">
            Pusat Pembayaran PASARLORE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Pembayaran Transfer Bank Manual
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Lakukan pembayaran dan konfirmasi pesanan Anda dengan mengunggah bukti transfer.
          </p>
        </div>

        {/* Check Order Search Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
          <h2 className="text-sm font-bold text-slate-900 mb-2">
            Sudah Memiliki Nomor Pesanan?
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Masukkan nomor pesanan Anda (contoh: <code>ORD-123456-789</code>) untuk membuka formulir upload bukti transfer.
          </p>

          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Nomor Pesanan (ORD-...)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white uppercase font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs transition-colors shadow-xs"
            >
              Konfirmasi
            </button>
          </form>
        </div>

        {/* Official Bank Accounts List */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Rekening Resmi PASARLORE
            </h2>
            <p className="text-xs text-slate-500">
              Hanya lakukan transfer ke rekening bank resmi beratasnamakan PASARLORE INDONESIA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PAYMENT_METHODS.map((pm) => (
              <div
                key={pm.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm mb-4">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{pm.bankName}</h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Atas Nama: <strong className="text-slate-800">{pm.accountHolder}</strong>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {pm.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(pm.accountNumber, pm.id)}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-500 transition-colors"
                      title="Salin Nomor Rekening"
                    >
                      {copiedBank === pm.id ? (
                        <Check className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  {pm.instructions}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
