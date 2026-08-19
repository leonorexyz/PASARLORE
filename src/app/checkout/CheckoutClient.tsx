"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah, MOCK_PAYMENT_METHODS } from "@/lib/mock-data";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle,
  MapPin,
  Phone,
  User as UserIcon,
  Mail,
  ArrowLeft,
  ChevronRight,
  Building,
  AlertCircle,
  Lock,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/OptimizedImage";

export function CheckoutClient() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, isAuthenticated, login } = useAuth();

  // Form State
  const [name, setName] = useState(user?.name || "Budi Santoso");
  const [email, setEmail] = useState(user?.email || "budi.santoso@gmail.com");
  const [phone, setPhone] = useState("081234567890");
  const [address, setAddress] = useState("Jl. Mawar No. 12, RT 04 / RW 02");
  const [city, setCity] = useState("Jakarta Selatan");
  const [postalCode, setPostalCode] = useState("12345");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    MOCK_PAYMENT_METHODS[0].id
  );
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentMethod: any;
  } | null>(null);

  // Calculations
  const shippingFee = totalPrice >= 150000 ? 0 : 15000;
  const finalTotal = totalPrice + shippingFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    // Simulate order creation API call
    setTimeout(() => {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
        100 + Math.random() * 900
      )}`;
      const pm = MOCK_PAYMENT_METHODS.find((p) => p.id === selectedPaymentMethodId);

      setOrderSuccessData({
        orderNumber,
        totalAmount: finalTotal,
        paymentMethod: pm,
      });

      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  if (orderSuccessData) {
    return (
      <div className="py-16 bg-slate-50 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4">
          <div className="bg-white rounded-3xl border border-amber-300 p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">
                Pesanan Berhasil Dibuat
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Terima Kasih atas Pesanan Anda!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Nomor Pesanan:{" "}
                <strong className="text-amber-700 font-mono text-base">
                  {orderSuccessData.orderNumber}
                </strong>
              </p>
            </div>

            {/* Payment instructions card */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Instruksi Transfer Manual</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bank Tujuan:</span>
                  <span className="font-bold text-slate-900">
                    {orderSuccessData.paymentMethod?.bankName}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    {orderSuccessData.paymentMethod?.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Atas Nama:</span>
                  <span className="font-semibold text-slate-900">
                    {orderSuccessData.paymentMethod?.accountHolder}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-700 font-bold">Total Pembayaran:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatRupiah(orderSuccessData.totalAmount)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {orderSuccessData.paymentMethod?.instructions}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/katalog"
                className="flex-1 py-3 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Belanja Lagi
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-slate-900">Tidak ada produk untuk di-checkout</h2>
          <p className="text-xs text-slate-500 mt-2">
            Silakan pilih produk terlebih dahulu dari katalog toko serba ada.
          </p>
          <Link
            href="/katalog"
            className="mt-6 inline-block py-3 px-6 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Lihat Katalog Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/keranjang"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Keranjang</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Formulir Pemesanan & Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lengkapi informasi pengiriman dan pilih metode pembayaran transfer bank.
          </p>
        </div>

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Customer Details, Address, and Payment */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Customer Profile */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Informasi Pemesan
                    </h2>
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {isAuthenticated ? "Akun Terhubung" : "Checkout Cepat"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp / Telepon *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08123456789"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email (Untuk Bukti Pesanan) *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">
                    Alamat Pengiriman
                  </h2>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Lengkap (Nama Jalan, No Rumah, RT/RW, Patokan) *
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Tuliskan alamat pengiriman lengkap..."
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white resize-none"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kota / Kabupaten *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Jakarta Selatan"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kode Pos *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="12345"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Pengiriman (Opsional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Contoh: Titipkan ke satpam jika tidak ada di rumah"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">
                    Pilihan Metode Pembayaran (Transfer Bank Manual)
                  </h2>
                </div>

                <div className="space-y-3 pt-1">
                  {MOCK_PAYMENT_METHODS.map((pm) => {
                    const isSelected = selectedPaymentMethodId === pm.id;
                    return (
                      <label
                        key={pm.id}
                        onClick={() => setSelectedPaymentMethodId(pm.id)}
                        className={`p-4 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-400 shadow-xs"
                            : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={isSelected}
                            onChange={() => setSelectedPaymentMethodId(pm.id)}
                            className="mt-1 accent-amber-500 w-4 h-4"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {pm.bankName}
                            </div>
                            <div className="text-[11px] font-mono text-amber-700 font-bold mt-0.5">
                              No. Rekening: {pm.accountNumber}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              a.n. {pm.accountHolder}
                            </div>
                          </div>
                        </div>

                        <Building className="w-5 h-5 text-slate-400 shrink-0" />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Submit */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Items Review */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Item Belanja ({totalItems} barang)
                </h3>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.quantity} x {formatRupiah(item.product.price)}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 shrink-0">
                        {formatRupiah(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-amber-700 font-bold">GRATIS</span>
                      ) : (
                        formatRupiah(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">Total Pembayaran</span>
                    <span className="text-lg font-black text-slate-900">
                      {formatRupiah(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Pesanan...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Konfirmasi & Buat Pesanan</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  Dengan mengklik konfirmasi, Anda menyetujui syarat & ketentuan toko PASARLORE.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
