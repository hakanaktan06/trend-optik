"use client";

import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

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

          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2 md:gap-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
                Hızlı Erişim
              </h4>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: "Güneş Gözlükleri", href: "#" },
                  { label: "Numaralı Gözlükler", href: "#" },
                  { label: "Lens Çözümleri", href: "#" },
                  { label: "Göz Muayenesi", href: "#" },
                  { label: "Kampanyalar", href: "#" },
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
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
                >
                  <Phone size={14} className="text-[var(--accent-gold)]/50 shrink-0" />
                  <span className="truncate">0531 207 58 18</span>
                </a>
                <a
                  href="mailto:info@trendoptikmersin.com"
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-light"
                >
                  <Mail size={14} className="text-[var(--accent-gold)]/50 shrink-0" />
                  <span className="truncate">info@trendoptik</span>
                </a>
                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-white/25 font-light">
                  <MapPin size={14} className="text-[var(--accent-gold)]/50 mt-0.5 shrink-0" />
                  <span className="truncate">Mersin, Türkiye</span>
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
