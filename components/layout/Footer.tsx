"use client";

import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle } from "lucide-react";

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
  if (pathname?.startsWith("/panel")) return null;
  return (
    <footer className="relative bg-[var(--background)] border-t border-white/[0.04]">
      {/* Gold Divider */}
      <div className="divider-gold" />

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-gold-light)] to-[var(--accent-gold-dark)] flex items-center justify-center">
                <span className="text-[#050505] font-bold text-sm">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-tight text-white leading-none">
                  TREND OPTİK
                </span>
                <span className="text-[10px] font-medium tracking-[0.35em] text-[var(--accent-gold)] uppercase leading-none mt-0.5">
                  MERSİN
                </span>
              </div>
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

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Hızlı Erişim
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Güneş Gözlükleri", href: "/gunes-gozlugu" },
                { label: "Numaralı Gözlükler", href: "/numarali-gozluk" },
                { label: "Lens Çözümleri", href: "/lens" },
                { label: "Göz Muayenesi", href: "/#faq" },
                { label: "Kampanyalar", href: "/katalog" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/25 hover:text-[var(--accent-gold)] transition-colors duration-300 font-light"
                >
                  {link.label}
                </a>
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
                className="flex items-center gap-3 text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
              >
                <Phone size={14} className="text-[var(--accent-gold)]/50" />
                0531 207 58 18
              </a>
              <a
                href="https://wa.me/905312075818"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
              >
                <MessageCircle size={14} className="text-[var(--accent-gold)]/50" />
                WhatsApp ile Yazın
              </a>
              <div className="flex items-start gap-3 text-sm text-white/25 font-light">
                <MapPin size={14} className="text-[var(--accent-gold)]/50 mt-0.5 flex-shrink-0" />
                <span>Çiftlikköy Mah., Mimar Sinan Cad., Paradise Homes Sitesi, B-Blok No: 24/BB, Yenişehir / Mersin</span>
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
            <a href="#" className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-300 font-light">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-300 font-light">
              Kullanım Koşulları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
