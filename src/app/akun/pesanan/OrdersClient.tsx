"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/lib/mock-data";
import {
  Package,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

export function OrdersClient() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const url = user ? `/api/orders?userId=${user.id}` : "/api/orders";
        const res = await fetch(url).then((r) => r.json());
        if (res?.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const handleReorder = async (order: any) => {
    setReorderingId(order.id);
    try {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity,
              userId: user?.id,
            }),
          });
        }
      }
      router.push("/keranjang");
    } catch (e) {
      console.error(e);
      router.push("/keranjang");
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selesai":
        return (
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </span>
        );
      case "dikirim":
        return (
          <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Sedang Dikirim</span>
          </span>
        );
      case "diproses":
        return (
          <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Diproses</span>
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/akun"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Akun</span>
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            Total {orders.length} Pesanan
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">
              Daftar Transaksi
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Riwayat Pesanan Belanja
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau status pengiriman, bukti transfer manual, dan rincian barang belanjaan Anda.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Memuat data pesanan...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Belum Ada Riwayat Pesanan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ayo temukan berbagai produk pilihan kebutuhan Anda di toko serba ada PASARLORE!
              </p>
              <Link
                href="/katalog"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl text-xs shadow-md shadow-amber-400/20"
              >
                Mulai Belanja Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {ord.orderNumber}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Dipesan pada{" "}
                      {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div>
                      <div className="text-[10px] text-slate-400 text-right">Total Belanja:</div>
                      <div className="font-black text-slate-900 text-sm text-right">
                        {formatRupiah(ord.totalAmount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReorder(ord)}
                        disabled={reorderingId === ord.id}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        title="Beli ulang barang dalam pesanan ini"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                        <span>{reorderingId === ord.id ? "Memproses..." : "Beli Lagi"}</span>
                      </button>

                      <Link
                        href={`/pembayaran/${ord.orderNumber}`}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-xs"
                      >
                        <span>Lihat Rincian</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
