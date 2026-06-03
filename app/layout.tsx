import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
  title: "Trend Optik | Premium Güneş ve Optik Koleksiyonları",
  description:
    "Dünyanın en seçkin markaları, el yapımı asetat çerçeveler ve ileri teknoloji cam çözümleri. Lüks optik deneyimini keşfedin.",
  keywords: [
    "trend optik",
    "premium gözlük",
    "lüks güneş gözlüğü",
    "el yapımı asetat çerçeve",
    "trend optik mersin",
    "özel tasarım gözlük",
    "optik",
    "lens",
  ],
  openGraph: {
    title: "Trend Optik | Premium Güneş ve Optik Koleksiyonları",
    description:
      "Dünyanın en seçkin markaları, el yapımı asetat çerçeveler ve ileri teknoloji cam çözümleri. Lüks optik deneyimini keşfedin.",
    type: "website",
    locale: "tr_TR",
    siteName: "Trend Optik",
    images: [
      {
        url: "/images/og-image.png", // Public klasöründeki kapak resmi
        width: 1200,
        height: 630,
        alt: "Trend Optik Premium Koleksiyon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend Optik | Premium Güneş ve Optik Koleksiyonları",
    description:
      "Dünyanın en seçkin markaları, el yapımı asetat çerçeveler ve ileri teknoloji cam çözümleri. Lüks optik deneyimini keşfedin.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Optician",
    "name": "Trend Optik",
    "description": "Dünyanın en seçkin markaları, el yapımı asetat çerçeveler ve ileri teknoloji cam çözümleri. Lüks optik deneyimini keşfedin.",
    "logo": "https://trendoptikk.vercel.app/logo.png",
    "image": "https://trendoptikk.vercel.app/logo.png",
    "telephone": "+90 531 207 58 18",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mersin",
      "addressCountry": "TR"
    },
    "url": "https://trendoptikk.vercel.app"
  };

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#050505] text-white grain">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </body>
    </html>
  );
}
