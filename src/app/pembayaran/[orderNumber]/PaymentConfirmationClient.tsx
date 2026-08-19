"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatRupiah, MOCK_PAYMENT_METHODS } from "@/lib/mock-data";
import {
  CreditCard,
  Copy,
  Check,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Clock,
  ChevronRight,
  ArrowLeft,
  Building,
  Image as ImageIcon,
} from "lucide-react";

interface PaymentConfirmationProps {
  orderNumber: string;
}

export function PaymentConfirmationClient({ orderNumber }: PaymentConfirmationProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(MOCK_PAYMENT_METHODS[0]);
  const [senderName, setSenderName] = useState("");
  const [senderBank, setSenderBank] = useState("BCA");
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock order total
  const orderAmount = 289000;

  const handleCopy = (text: string, type: "account" | "amount") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Menunggu Pembayaran Transfer Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Instruksi & Konfirmasi Pembayaran
          </h1>
          <p className="text-xs text-slate-500">
            Nomor Pesanan: <strong className="text-amber-700 font-mono">{orderNumber}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Bank Account Details */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-500" />
                <span>Rekening Tujuan Transfer</span>
              </h2>

              {/* Bank selector */}
              <div className="flex gap-2">
                {MOCK_PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedMethod(pm)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod.id === pm.id
                        ? "bg-amber-400 border-amber-400 text-slate-950 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pm.bankName.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Account details card */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <div className="text-xs text-slate-500">{selectedMethod.bankName}</div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Nomor Rekening:</div>
                    <div className="text-lg font-black font-mono text-slate-900">
                      {selectedMethod.accountNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedMethod.accountNumber, "account")}
                    className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-600" />
                        <span>Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-amber-200/60">
                  <div className="text-[10px] text-slate-400">Atas Nama:</div>
                  <div className="text-xs font-bold text-slate-800">
                    {selectedMethod.accountHolder}
                  </div>
                </div>
              </div>

              {/* Amount to transfer */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Jumlah yang Harus Ditransfer:</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {formatRupiah(orderAmount)}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(orderAmount.toString(), "amount")}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1 shadow-2xs"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-500 space-y-1 leading-relaxed">
                <p><strong>Langkah Pembayaran:</strong></p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Transfer tepat sesuai nominal tagihan pesanan Anda.</li>
                  <li>Simpan struk / bukti screenshot transfer berhasil.</li>
                  <li>Upload bukti pada formulir konfirmasi di samping.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Proof Form */}
          <div className="md:col-span-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>Upload Bukti Pembayaran</span>
              </h2>

              {isSubmitted ? (
                <div className="p-8 text-center space-y-4 bg-amber-50/50 rounded-2xl border border-amber-200">
                  <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bukti Pembayaran Terkirim!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Admin PASARLORE akan segera memverifikasi bukti transfer Anda. Status pesanan akan otomatis terupdate dalam 5-15 menit.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/katalog"
                      className="inline-block py-2.5 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Kembali ke Belanja
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pengirim di Rekening *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Pengirim *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderBank}
                      onChange={(e) => setSenderBank(e.target.value)}
                      placeholder="Contoh: Bank BCA / Mandiri"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                    />
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Foto Bukti Transfer / Resi *
                    </label>
                    <label className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-amber-50/20 block text-center">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {proofFile ? (
                        <div className="space-y-2">
                          <img
                            src={proofFile}
                            alt="Bukti Transfer"
                            className="max-h-32 rounded-lg object-contain mx-auto border"
                          />
                          <div className="text-[11px] text-amber-700 font-bold">
                            Klik untuk ganti foto bukti
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                          <div className="text-xs font-bold text-slate-700">
                            Pilih Foto / Screenshot Bukti
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Format JPG, PNG, atau WebP (Maks. 5MB)
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Sudah ditransfer dari rekening istri"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !proofFile}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/25 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Mengunggah Bukti...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Kirim Konfirmasi Pembayaran</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
