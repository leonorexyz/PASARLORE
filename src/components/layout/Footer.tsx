import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pengiriman Cepat</h4>
              <p className="text-xs text-slate-400 mt-1">
                Barang dikemas rapi dengan proteksi bubble wrap dan dikirim tepat waktu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Produk Original</h4>
              <p className="text-xs text-slate-400 mt-1">
                Kualitas terjamin langsung dari distributor dan pemasok resmi terpercaya.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Transfer Manual Aman</h4>
              <p className="text-xs text-slate-400 mt-1">
                Verifikasi cepat dengan upload bukti transfer rekening resmi PASARLORE.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Garansi Retur Mudah</h4>
              <p className="text-xs text-slate-400 mt-1">
                Jika barang cacat atau tidak sesuai pesanan, proses retur cepat & jelas.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white/10 p-3 rounded-2xl inline-block border border-white/10">
              <Logo size="md" theme="dark" showTagline />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PASARLORE adalah platform toko serba ada dan department store online modern.
              Menyediakan berbagai kebutuhan elektronik, consumer goods, makanan & minuman,
              fashion, dan produk kesehatan berkualitas dengan harga terbaik.
            </p>
          </div>

          {/* Col 2: Kategori */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kategori Pilihan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/katalog?category=elektronik-gadget" className="hover:text-amber-400 transition-colors">
                  Elektronik & Gadget
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=kebutuhan-rumah-tangga" className="hover:text-amber-400 transition-colors">
                  Kebutuhan Rumah Tangga
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=makanan-minuman" className="hover:text-amber-400 transition-colors">
                  Makanan & Minuman Pilihan
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=fashion-aksesoris" className="hover:text-amber-400 transition-colors">
                  Fashion & Aksesoris
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=kesehatan-kecantikan" className="hover:text-amber-400 transition-colors">
                  Kesehatan & Kecantikan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bantuan & Akun */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Bantuan & Layanan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/akun" className="hover:text-amber-400 transition-colors">
                  Cek Status Pesanan
                </Link>
              </li>
              <li>
                <Link href="/keranjang" className="hover:text-amber-400 transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Portal Admin & Stok
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Syarat & Ketentuan Layanan
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Kebijakan Privasi
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Jam Operasional */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kontak PASARLORE</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Jl. Pasar Induk Nusantara No. 88, Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+62 812-3456-7890 (CS WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@pasarlore.com</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-amber-400 font-bold">Layanan Pengiriman</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">
                Senin - Minggu: 08.00 - 20.00 WIB
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PASARLORE. Hak Cipta Dilindungi.</p>
          <p className="text-[11px]">
            Platform toko serba ada & sistem manajemen stok terpadu.
          </p>
        </div>
      </div>
    </footer>
  );
}
