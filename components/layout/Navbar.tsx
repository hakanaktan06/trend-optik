"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Katalog", href: "/katalog" },
  { label: "Sipariş Takibi", href: "/#takip" },
  { label: "Markalar", href: "/#markalar" },
  { label: "İletişim", href: "/#iletisim" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "py-3 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.06]"
            : "py-5 bg-transparent"
        )}
      >
        <div className="container-premium flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-gold-light)] to-[var(--accent-gold-dark)] flex items-center justify-center shadow-lg shadow-[var(--accent-gold)]/20 transition-shadow duration-500 group-hover:shadow-[var(--accent-gold)]/40">
                <span className="text-[#050505] font-bold text-lg font-[var(--font-display)]">T</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-gold-light)] to-[var(--accent-gold-dark)] blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white leading-none">
                TREND
              </span>
              <span className="text-[10px] font-medium tracking-[0.35em] text-[var(--accent-gold)] uppercase leading-none mt-0.5">
                OPTİK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[var(--accent-gold)] transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+905551234567"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-300"
            >
              <Phone size={14} className="text-[var(--accent-gold)]" />
              <span className="hidden xl:inline">Bizi Arayın</span>
            </a>
            <Link
              href="/#iletisim"
              className="px-5 py-2.5 text-sm font-medium text-[#050505] bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] rounded-full hover:shadow-lg hover:shadow-[var(--accent-gold)]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Randevu Al
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-xl glass"
            aria-label="Menü"
          >
            {isMobileOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-2xl font-light text-white/80 hover:text-[var(--accent-gold)] py-3 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <a
                  href="tel:+905551234567"
                  className="flex items-center gap-2 text-sm text-white/50"
                >
                  <Phone size={14} className="text-[var(--accent-gold)]" />
                  0555 123 45 67
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-white/50"
                >
                  <MapPin size={14} className="text-[var(--accent-gold)]" />
                  İstanbul, Türkiye
                </a>
                <a
                  href="#iletisim"
                  onClick={() => setIsMobileOpen(false)}
                  className="mt-4 px-8 py-3 text-sm font-medium text-[#050505] bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] rounded-full"
                >
                  Randevu Al
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
