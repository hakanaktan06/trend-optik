import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import MetaPixel from "@/components/MetaPixel";
import CookieConsent from "@/components/CookieConsent";
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
  metadataBase: new URL("https://trendoptikmersin.com"),
  title: {
    default: "Trend Optik Mersin | Optik, Gözlük & Güneş Gözlüğü",
    template: "%s | Trend Optik Mersin",
  },
  description:
    "Mersin Yenişehir'in premium optik mağazası. Numaralı gözlük, güneş gözlüğü, lens ve göz muayenesi. Ray-Ban, Prada, Gucci, Oakley orijinal ürünler. WhatsApp'tan hemen bilgi alın.",
  alternates: { canonical: "https://trendoptikmersin.com" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Trend Optik Mersin",
    url: "https://trendoptikmersin.com",
    title: "Trend Optik Mersin | Optik, Gözlük & Güneş Gözlüğü",
    description:
      "Mersin Yenişehir'in premium optik mağazası. Numaralı gözlük, güneş gözlüğü, lens ve göz muayenesi. Ray-Ban, Prada, Gucci, Oakley orijinal ürünler.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend Optik Mersin | Optik, Gözlük & Güneş Gözlüğü",
    description:
      "Mersin Yenişehir'in premium optik mağazası. Numaralı gözlük, güneş gözlüğü, lens ve göz muayenesi. Ray-Ban, Prada, Gucci, Oakley orijinal ürünler.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: "Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const opticianSchema = {
    "@context": "https://schema.org",
    "@type": "Optician",
    "name": "Trend Optik Mersin",
    "image": "https://trendoptikmersin.com/images/og-image.png",
    "@id": "https://trendoptikmersin.com",
    "url": "https://trendoptikmersin.com",
    "telephone": "+905312075818",
    "priceRange": "₺₺₺",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Çiftlikköy Mah., Mimar Sinan Cad., Paradise Homes Sitesi, B-Blok No: 24/BB",
      "addressLocality": "Yenişehir",
      "addressRegion": "Mersin",
      "postalCode": "33150",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.7740608",
      "longitude": "34.5639134"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:30",
        "closes": "18:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:30",
        "closes": "17:30"
      }
    ],
    "sameAs": ["https://instagram.com/trendoptikmersin"],
    "areaServed": { "@type": "City", "name": "Mersin" }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Trend Optik Mersin",
    "url": "https://trendoptikmersin.com"
  };

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#050505] text-white grain">
        {/* Optician LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(opticianSchema) }}
        />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>

        <GoogleAnalytics gaId="G-PVZTDX1VJR" />
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  );
}
