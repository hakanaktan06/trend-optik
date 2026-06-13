"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MapPin, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LOGO_KEY = "trend-optik-logo";

const staticLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Katalog", href: "/katalog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Sipariş Takibi", href: "/#takip" },
  { label: "İletişim", href: "/#iletisim" },
];

const beforeBrands = staticLinks.slice(0, 3);
const afterBrands = staticLinks.slice(3);

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [brands, setBrands] = useState<{ name: string; slug: string }[]>([]);
  // Initialize from localStorage so no flash on page load
  const [logoUrl, setLogoUrl] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem(LOGO_KEY) || "";
    return "";
  });

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return;

    const fetchData = async () => {
      try {
        // Use Firestore REST API — no auth required, works for all visitors
        const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

        const [brandsRes, logoRes] = await Promise.all([
          fetch(`${base}/brands?pageSize=100`),
          fetch(`${base}/settings/site`),
        ]);

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          const data = (brandsData.documents || [])
            .map((doc: any) => ({
              name: doc.fields?.name?.stringValue || "",
              slug: doc.fields?.slug?.stringValue || "",
              order: doc.fields?.order?.integerValue
                ? parseInt(doc.fields.order.integerValue)
                : 999,
            }))
            .filter((b: any) => b.name && b.slug)
            .sort((a: any, b: any) => a.order - b.order);
          setBrands(data);
        }

        if (logoRes.ok) {
          const logoData = await logoRes.json();
          const url = logoData.fields?.logoUrl?.stringValue || "";
          setLogoUrl(url);
          if (url) localStorage.setItem(LOGO_KEY, url);
          else localStorage.removeItem(LOGO_KEY);
        }
      } catch (e) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) setIsBrandsOpen(false);
  }, [isMobileOpen]);

  if (pathname?.startsWith("/panel")) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "py-2 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-sm"
            : "py-4 bg-transparent"
        )}
      >
        <div className="container-premium flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center relative z-50">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Trend Optik Mersin"
                className="h-14 md:h-16 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            ) : (
              <span className="flex flex-col items-start group">
                <span className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-white drop-shadow-md transition-all duration-300 group-hover:tracking-[0.25em]">
                  TREND <span className="font-light text-white/70">OPTİK</span>
                </span>
                <span className="text-[0.60rem] tracking-[0.4em] uppercase text-white/40 ml-1 mt-[2px] group-hover:text-white/60 transition-colors duration-300">
                  Mersin
                </span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+905312075818"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-300"
            >
              <Phone size={14} className="text-[var(--accent-color)]" />
              <span className="hidden xl:inline">Bizi Arayın</span>
            </a>
            <Link
              href="/#iletisim"
              className="px-5 py-2.5 text-sm font-medium text-black bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-color)] rounded-full hover:shadow-lg hover:shadow-[var(--accent-color)]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Randevu Al
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2 relative z-50">
            <a
              href="https://wa.me/905312075818?text=Merhaba,%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-xl glass"
              aria-label="Menü"
            >
              {isMobileOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-3xl lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex-1 flex flex-col items-center justify-center p-10">
              <div className="w-full max-w-xs space-y-6">

                {/* 01–03 */}
                {beforeBrands.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-end gap-4 py-2"
                    >
                      <span className="text-[var(--accent-color)] text-[10px] font-bold mb-2">0{i + 1}</span>
                      <span className="text-4xl font-bold text-white tracking-tighter group-hover:text-[var(--accent-color)] transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* 04: Markalarımız accordion */}
                <motion.div
                  key="brands-accordion"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => setIsBrandsOpen(prev => !prev)}
                    className="group flex items-end gap-4 py-2 w-full text-left"
                  >
                    <span className="text-[var(--accent-color)] text-[10px] font-bold mb-2">04</span>
                    <span className="text-4xl font-bold text-white tracking-tighter group-hover:text-[var(--accent-color)] transition-colors flex-1">
                      Markalarımız
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-white/40 mb-2 transition-transform duration-300",
                        isBrandsOpen && "rotate-180 text-[var(--accent-color)]"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isBrandsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pt-2 pb-4 space-y-3 border-l border-[var(--accent-color)]/20 ml-3">
                          {brands.length === 0 ? (
                            <span className="text-sm text-white/30">Yükleniyor...</span>
                          ) : (
                            brands.map((b) => (
                              <Link
                                key={b.slug}
                                href={`/marka/${b.slug}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="block text-xl font-semibold text-white/60 hover:text-white transition-colors py-0.5"
                              >
                                {b.name}
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* 05–06 */}
                {afterBrands.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: (4 + i) * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-end gap-4 py-2"
                    >
                      <span className="text-[var(--accent-color)] text-[10px] font-bold mb-2">0{5 + i}</span>
                      <span className="text-4xl font-bold text-white tracking-tighter group-hover:text-[var(--accent-color)] transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-16 w-full max-w-xs grid grid-cols-1 gap-6"
              >
                <div className="h-px bg-white/10 w-full" />
                <div className="space-y-4">
                  <a href="tel:+905312075818" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                    <Phone size={16} className="text-[var(--accent-color)]" />
                    <span className="text-sm font-medium">0531 207 58 18</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Trend+Optik+Mersin+Yenisehir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/50 hover:text-white transition-colors"
                  >
                    <MapPin size={16} className="text-[var(--accent-color)]" />
                    <span className="text-sm font-medium">Yenişehir / Mersin</span>
                  </a>
                </div>

                <Link
                  href="/#iletisim"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full py-4 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-color)] text-black font-bold rounded-2xl text-center shadow-xl shadow-[var(--accent-color)]/20"
                >
                  Randevu Al
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
