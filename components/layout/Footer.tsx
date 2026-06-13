"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

// Instagram icon — Lucide React'te trademark nedeniyle yok, inline SVG
function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const socialLinks = [
  { icon: InstagramIcon, href: "https://instagram.com/trendoptikmersin", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/905312075818", label: "WhatsApp" },
];

export default function Footer() {
  const pathname = usePathname();
  const [brands, setBrands] = useState<{name: string, slug: string}[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const snap = await getDocs(query(collection(db, "brands"), orderBy("order", "asc"), limit(6)));
        const data: any[] = [];
        snap.forEach(d => data.push(d.data()));
        setBrands(data);
      } catch(e) {}
    };
    fetchBrands();
  }, []);

  if (pathname?.startsWith("/panel")) return null;
  return (
    <footer className="relative bg-[var(--background)] border-t border-white/[0.04]">
      {/* Gold Divider */}
      <div className="divider-gold" />

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white leading-none">
                TREND OPTİK
              </span>
              <span className="text-[10px] font-medium tracking-[0.35em] text-[var(--accent-gold)] uppercase leading-none mt-1">
                MERSİN
              </span>
            </div>
            <p className="text-sm text-white/25 font-light leading-relaxed max-w-xs">
              Premium gözlük koleksiyonları ve profesyonel göz sağlığı hizmetleri
              ile 15 yılı aşkın süredir yanınızdayız.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center group transition-all duration-300"
                >
                  <social.icon
                    size={16}
                    className="text-white/30 group-hover:text-[var(--accent-gold)] transition-colors duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3 md:gap-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
                Hızlı Erişim
              </h4>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: "Ana Sayfa", href: "/" },
                  { label: "Tüm Katalog", href: "/katalog" },
                  { label: "Hakkımızda", href: "/hakkimizda" },
                  { label: "Sipariş Takibi", href: "/#takip" },
                  { label: "İletişim", href: "/#iletisim" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/25 hover:text-[var(--accent-gold)] transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Brands */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
                Markalar
              </h4>
              <nav className="flex flex-col gap-2.5">
                {brands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/marka/${b.slug}`}
                    className="text-sm text-white/25 hover:text-[var(--accent-gold)] transition-colors duration-300 font-light"
                  >
                    {b.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
                İletişim
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:+905312075818"
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
                >
                  <Phone size={14} className="text-[var(--accent-gold)]/50 shrink-0" />
                  <span className="truncate">0531 207 58 18</span>
                </a>
                <a
                  href="https://wa.me/905312075818"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
                >
                  <MessageCircle size={14} className="text-[var(--accent-gold)]/50 shrink-0" />
                  <span className="truncate">WhatsApp ile Yazın</span>
                </a>
                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 font-light">
                  <MapPin size={14} className="text-[var(--accent-gold)]/50 mt-1 shrink-0" />
                  <div className="flex flex-col gap-2">
                    <span className="leading-relaxed">Çiftlikköy Mah., Mimar Sinan Cad., Paradise Homes Sitesi, B-Blok No: 24/BB, Yenişehir / Mersin</span>
                    <a 
                      href="https://maps.google.com/?q=Trend+Optik+Mersin+Yenisehir" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--accent-gold)] hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold"
                    >
                      Yol Tarifi Al →
                    </a>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-white/20 font-mono">
                  Pzt-Cum: 08:30-18:30<br/>
                  Cmt: 08:30-17:30<br/>
                  Paz: Kapalı
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15 font-light">
            © {new Date().getFullYear()} Trend Optik. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/905312075818?text=Merhaba"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/10 hover:text-white/30 transition-colors font-light"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/trendoptikmersin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/10 hover:text-white/30 transition-colors font-light"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
