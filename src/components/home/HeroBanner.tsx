import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, ShoppingCart, Zap, Star } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white py-16 sm:py-20 lg:py-24 border-b border-amber-500/10">
      {/* Background glowing orbs - Warm Amber */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PASARLORE — Toko Serba Ada & Marketplace Terlengkap</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Satu Tempat untuk{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                Segala Kebutuhan Anda
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Temukan produk elektronik canggih, kebutuhan rumah tangga harian (consumer goods),
              makanan & minuman premium, fashion trendi, hingga produk kecantikan dengan stok
              selalu terjamin dan harga bersahabat.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all text-sm group"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Jelajahi Semua Produk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-amber-300 hover:text-white font-bold rounded-xl text-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Kelola Stok (Admin)</span>
              </Link>
            </div>

            {/* Quick Metrics / Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Produk Original</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">10.000+</div>
                <div className="text-xs text-slate-400 mt-0.5">Pelanggan Aktif</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">Layanan Cepat</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Multi-Category Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-amber-400/20 p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    PASARLORE Live Stock
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Electronics item */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center font-bold text-amber-200">
                        🎧
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          TWS Earbuds Pro ANC
                        </div>
                        <div className="text-[11px] text-amber-300 font-mono">
                          SKU-ELK-001 • Stok: 35 unit
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">Rp 289.000</span>
                  </div>

                  {/* Consumer Goods item */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center font-bold text-amber-200">
                        🧴
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Deterjen Cair Konsentrat 1.8L
                        </div>
                        <div className="text-[11px] text-amber-300 font-mono">
                          SKU-CGD-001 • Stok: 65 unit
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">Rp 38.500</span>
                  </div>

                  {/* Food & Beverage item */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center font-bold text-amber-200">
                        ☕
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Kopi Arabika Gayo Single Origin
                        </div>
                        <div className="text-[11px] text-amber-300 font-mono">
                          SKU-FNB-001 • Stok: 28 unit
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">Rp 68.000</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Siap kirim ke seluruh wilayah</span>
                  </div>
                  <span className="text-amber-400 font-bold">Toko Buka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
