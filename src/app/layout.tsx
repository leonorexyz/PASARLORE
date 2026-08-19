import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pasarlore.com"),
  title: {
    default: "PASARLORE — Toko Serba Ada Online & Department Store Modern",
    template: "%s | PASARLORE",
  },
  description:
    "Toko online serba ada modern PASARLORE. Pilihan terlengkap produk elektronik & gadget, kebutuhan rumah tangga, makanan & minuman, fashion, dan perawatan diri.",
  keywords: [
    "pasarlore",
    "toko serba ada",
    "department store online",
    "elektronik murah",
    "gadget",
    "kebutuhan rumah tangga",
    "consumer goods",
    "fashion",
    "sembako",
  ],
  authors: [{ name: "PASARLORE Store" }],
  creator: "PASARLORE",
  publisher: "PASARLORE INDONESIA",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pasarlore.com",
    title: "PASARLORE — Toko Serba Ada Online & Department Store Modern",
    description:
      "Belanja segala kebutuhan hidup dari elektronik, consumer goods, fashion, hingga makanan & minuman di PASARLORE.",
    siteName: "PASARLORE",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "PASARLORE Department Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PASARLORE — Toko Serba Ada Online",
    description:
      "Pilihan terlengkap produk elektronik, consumer goods, makanan, dan fashion dengan harga terbaik.",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/pasarlore-icon.png",
    shortcut: "/images/pasarlore-icon.png",
    apple: "/images/pasarlore-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DepartmentStore",
    name: "PASARLORE",
    description: "Toko serba ada online terpercaya yang menjual elektronik, kebutuhan rumah tangga, consumer goods, fashion, makanan & minuman.",
    url: "https://pasarlore.com",
    telephone: "+6281234567890",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Pasar Induk Nusantara No. 88",
      addressLocality: "Indonesia",
      addressCountry: "ID",
    },
    currenciesAccepted: "IDR",
    paymentAccepted: "Bank Transfer",
    priceRange: "$$",
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950 bg-slate-50 text-slate-900">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
