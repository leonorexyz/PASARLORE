"use client";

import React, { useState, useEffect } from "react";
import { PaymentMethod } from "@/types";
import { MOCK_PAYMENT_METHODS } from "@/lib/mock-data";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Building,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  X,
  Lock,
} from "lucide-react";

export function PaymentSettingsAdminClient() {
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(null);

  // Form states
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/payments/settings").then((r) => r.json());
      if (res?.data) {
        setMethods(res.data);
      }
    } catch (e) {
      console.error("Load payment methods error:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setBankName("Bank BCA");
    setAccountNumber("");
    setAccountHolder("PT PASARLORE INDONESIA");
    setInstructions("Transfer ke rekening BCA, simpan bukti transfer untuk diunggah di halaman konfirmasi.");
    setIsActive(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (pm: PaymentMethod) => {
    setEditingMethod(pm);
    setBankName(pm.bankName);
    setAccountNumber(pm.accountNumber);
    setAccountHolder(pm.accountHolder);
    setInstructions(pm.instructions || "");
    setIsActive(pm.isActive);
  };

  const handleSaveMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingMethod) {
        // Edit
        await fetch("/api/payments/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMethod.id,
            bankName,
            accountNumber,
            accountHolder,
            instructions,
            isActive,
          }),
        });
        setEditingMethod(null);
      } else {
        // Add
        await fetch("/api/payments/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bankName,
            accountNumber,
            accountHolder,
            instructions,
            isActive,
          }),
        });
        setIsAddModalOpen(false);
      }

      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (pm: PaymentMethod) => {
    const updatedStatus = !pm.isActive;
    try {
      await fetch("/api/payments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pm.id,
          isActive: updatedStatus,
        }),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMethod = async () => {
    if (!deletingMethod) return;
    try {
      await fetch(`/api/payments/settings?id=${deletingMethod.id}`, {
        method: "DELETE",
      });
      await loadData();
      setDeletingMethod(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full text-xs">
            Metode Pembayaran
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Pengaturan Rekening Transfer Bank Manual
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi rekening bank resmi yang ditampilkan ke pembeli saat proses checkout.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-3 px-5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-amber-400/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekening Bank</span>
        </button>
      </div>

      {/* Payment Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((pm) => (
          <div
            key={pm.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              pm.isActive
                ? "bg-white border-amber-300 shadow-xs hover:border-amber-400"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(pm)}
                    className={`p-1 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ${
                      pm.isActive
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-slate-500 bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    {pm.isActive ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                        <span>Nonaktif</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h2 className="text-base font-black text-slate-900">{pm.bankName}</h2>
              <div className="text-xs text-slate-500 mt-1">
                Atas Nama: <strong className="text-slate-800">{pm.accountHolder}</strong>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] text-slate-400">Nomor Rekening:</div>
                <div className="font-mono font-black text-amber-700 text-base">
                  {pm.accountNumber}
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                {pm.instructions}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(pm)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeletingMethod(pm)}
                className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus Rekening"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingMethod) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingMethod ? "Edit Rekening Bank" : "Tambah Rekening Transfer"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMethod(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMethod} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bank *
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Contoh: Bank BCA / Bank Mandiri"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 1234567890"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Atas Nama Rekening *
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Contoh: PT PASARLORE INDONESIA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Petunjuk Transfer
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Petunjuk khusus atau format berita acara transfer..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Aktifkan Rekening Ini untuk Checkout
                </span>
              </label>

              <div className="flex items-center gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingMethod(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-400/20 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Rekening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Rekening Bank?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus rekening{" "}
                <strong>{deletingMethod.bankName}</strong> ({deletingMethod.accountNumber})?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMethod(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteMethod}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
