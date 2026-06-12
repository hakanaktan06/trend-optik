"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomBar() {
  const pathname = usePathname();

  // Hide in admin panel
  if (pathname?.startsWith("/panel")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:hidden pointer-events-none">
      <div className="flex items-center justify-between gap-3 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-2.5 rounded-full shadow-2xl pointer-events-auto">
        <a
          href="https://wa.me/905312075818?text=Merhaba,%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--accent-gold)] text-black rounded-full font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(216,168,72,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <MessageCircle size={18} />
          <span>Bilgi Al · WhatsApp</span>
        </a>
        <a
          href="tel:+905312075818"
          className="w-14 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-[0.98] transition-all shrink-0"
          aria-label="Ara"
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}
