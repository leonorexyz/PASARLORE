"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/common/Logo";
import { formatRupiah } from "@/lib/mock-data";
import {
  User as UserIcon,
  Mail,
  Lock,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building,
  CreditCard,
  Plus,
  AlertCircle,
  Edit2,
  X,
  Trash2,
} from "lucide-react";

export function AccountClient() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Address CRUD states
  const [addresses, setAddresses] = useState<any[]>([
    {
      id: "addr-1",
      label: "Rumah (Utama)",
      recipientName: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Mawar No. 12, RT 04 / RW 02",
      city: "Jakarta Selatan",
      postalCode: "12345",
    },
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addrLabel, setAddrLabel] = useState("Rumah");
  const [addrRecipient, setAddrRecipient] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");

  const reloadAddresses = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/addresses?userId=${user.id}`).then((r) => r.json());
      if (res?.data && res.data.length > 0) {
        setAddresses(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      reloadAddresses();
      // Fetch user's orders
      fetch(`/api/orders?userId=${user.id}`)
        .then((r) => r.json())
        .then((res) => {
          if (res?.data) setOrders(res.data);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authMode,
          email,
          name: authMode === "register" ? name : undefined,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses autentikasi");
      }

      login(data.user.email, data.user.name, data.user.role);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Logo & Header */}
        <div className="text-center max-w-sm mx-auto space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" showTagline />
          </div>
        </div>

        {isAuthenticated && user ? (
          /* Profile & Orders Dashboard View */
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-400/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[10px] font-bold uppercase">
                      {user.role === "admin" ? "Super Admin" : "Customer"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setProfileName(user.name);
                    setProfileEmail(user.email);
                    setProfileSuccessMsg("");
                    setIsEditingProfile(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex-1 sm:flex-initial px-4 py-2.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditingProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      Perbarui Data Profil
                    </h3>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {profileSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      try {
                        await fetch("/api/user/profile", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: user.id,
                            name: profileName,
                            email: profileEmail,
                          }),
                        });
                        login(profileEmail, profileName, user.role);
                        setProfileSuccessMsg("Profil berhasil diperbarui!");
                        setTimeout(() => {
                          setIsEditingProfile(false);
                          setProfileSuccessMsg("");
                        }, 1200);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-400/20 disabled:opacity-50"
                      >
                        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Orders Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Riwayat Pesanan Belanja Saya</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {orders.length} Pesanan
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Anda belum memiliki riwayat pesanan.
                  </p>
                  <Link
                    href="/katalog"
                    className="inline-block px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-slate-900">
                          {ord.orderNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-xs text-slate-900">
                          {formatRupiah(ord.totalAmount)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            ord.status === "selesai"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.status === "diproses"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {ord.status.replace("_", " ")}
                        </span>
                        <Link
                          href={`/pembayaran/${ord.orderNumber}`}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Addresses Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Daftar Alamat Pengiriman Tersimpan ({addresses.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {addresses.map((addr, idx) => (
                  <div
                    key={addr.id || idx}
                    className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/30 relative space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                        {idx === 0 && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                            Utama
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        {addr.recipientName} ({addr.phone})
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {addr.address}, {addr.city} {addr.postalCode}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60">
                      <button
                        onClick={() => {
                          setEditingAddress(addr);
                          setAddrLabel(addr.label);
                          setAddrRecipient(addr.recipientName);
                          setAddrPhone(addr.phone);
                          setAddrAddress(addr.address);
                          setAddrCity(addr.city);
                          setAddrPostalCode(addr.postalCode);
                          setIsAddressModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-amber-100 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (addresses.length <= 1) return;
                          try {
                            await fetch(`/api/user/addresses?id=${addr.id}`, { method: "DELETE" });
                            setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="p-1 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Alamat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => {
                    setEditingAddress(null);
                    setAddrLabel("Rumah");
                    setAddrRecipient(user.name);
                    setAddrPhone("081234567890");
                    setAddrAddress("");
                    setAddrCity("Jakarta");
                    setAddrPostalCode("");
                    setIsAddressModalOpen(true);
                  }}
                  className="p-4 rounded-2xl border border-dashed border-slate-300 hover:border-amber-400 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-slate-50/50 hover:bg-amber-50/20 min-h-[120px]"
                >
                  <Plus className="w-6 h-6 text-slate-400 group-hover:text-amber-600 transition-colors mb-1" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
                    Tambah Alamat Baru
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Alamat kantor, apartemen, dll.
                  </span>
                </div>
              </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingAddress ? "Ubah Alamat Pengiriman" : "Tambah Alamat Baru"}
                    </h3>
                    <button
                      onClick={() => setIsAddressModalOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      try {
                        if (editingAddress) {
                          await fetch("/api/user/addresses", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: editingAddress.id,
                              label: addrLabel,
                              recipientName: addrRecipient,
                              phone: addrPhone,
                              address: addrAddress,
                              city: addrCity,
                              postalCode: addrPostalCode,
                            }),
                          });
                        } else {
                          await fetch("/api/user/addresses", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              userId: user.id,
                              label: addrLabel,
                              recipientName: addrRecipient,
                              phone: addrPhone,
                              address: addrAddress,
                              city: addrCity,
                              postalCode: addrPostalCode,
                            }),
                          });
                        }
                        await reloadAddresses();
                        setIsAddressModalOpen(false);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Label Alamat *
                      </label>
                      <input
                        type="text"
                        required
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="Contoh: Rumah / Kantor"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nama Penerima *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrRecipient}
                          onChange={(e) => setAddrRecipient(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nomor Telepon *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={addrAddress}
                        onChange={(e) => setAddrAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kota *
                        </label>
                        <input
                          type="text"
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={addrPostalCode}
                          onChange={(e) => setAddrPostalCode(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-400/20 disabled:opacity-50"
                      >
                        {isSubmitting ? "Menyimpan..." : "Simpan Alamat"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Login / Register Form Card */
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "login"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "register"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
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
                      placeholder="Contoh: Budi Santoso"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-400/25 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Memproses...</span>
                ) : (
                  <span>{authMode === "login" ? "Masuk ke Akun" : "Daftar Akun PASARLORE"}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
