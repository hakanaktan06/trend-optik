import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trend Optik Mersin — Premium Gözlük Koleksiyonu",
  description:
    "Dünyanın en prestijli markalarından seçilmiş premium gözlük koleksiyonları. Ray-Ban, Gucci, Prada, Tom Ford ve daha fazlası. Orijinal garantili, profesyonel göz sağlığı hizmetleri.",
  keywords: [
    "trend optik mersin",
    "gözlük",
    "güneş gözlüğü",
    "numaralı gözlük",
    "ray-ban",
    "gucci",
    "premium gözlük",
    "optik",
    "göz muayenesi",
    "lens",
  ],
  openGraph: {
    title: "Trend Optik Mersin — Premium Gözlük Koleksiyonu",
    description:
      "Dünyanın en prestijli markalarından seçilmiş premium gözlük koleksiyonları.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#050505] text-white grain">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
