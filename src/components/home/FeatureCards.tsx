import React from "react";
import { ShieldCheck, Package, Truck, RotateCcw } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "100% Produk Original & Baru",
      desc: "Seluruh barang elektronik, consumer goods, dan sembako terjamin keasliannya dan bersegel resmi.",
    },
    {
      icon: <Package className="w-6 h-6 text-amber-500" />,
      title: "Pilihan Lengkap Serba Ada",
      desc: "Dari gadget, perlengkapan rumah tangga, hingga makanan dan fashion tersedia lengkap di satu tempat.",
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      title: "Pengiriman Cepat & Aman",
      desc: "Didukung kurir terpercaya dan pengemasan ekstra aman dengan bubble wrap tanpa biaya tambahan.",
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-amber-500" />,
      title: "Garansi & Layanan Prima",
      desc: "Jaminan kepuasan pelanggan dengan proses retur mudah dan layanan bantuan pelanggan responsif.",
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
