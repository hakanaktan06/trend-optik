"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Glasses, Target, Box, Award, Eye, LogOut, Send, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_KEY = "trend-optik-logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem(LOGO_KEY) || "";
    return "";
  });

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return;
    fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/settings/site`)
      .then(r => r.json())
      .then(d => {
        const url = d.fields?.logoUrl?.stringValue || "";
        setLogoUrl(url);
        if (url) localStorage.setItem(LOGO_KEY, url);
        else localStorage.removeItem(LOGO_KEY);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { id: "home", label: "Ana Ekran", icon: LayoutGrid },
    { id: "brands", label: "Markalar", icon: Award },
    { id: "products", label: "Ürün Vitrini", icon: Glasses },
    { id: "radar", label: "Akıllı Radar", icon: Target },
    { id: "orders", label: "Siparişler", icon: Box },
    { id: "certs", label: "Sertifikalar", icon: Award },
    { id: "lenses", label: "Lens Radarı", icon: Eye },
    { id: "telegram", label: "Telegram Ayarları", icon: Send },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-[#0a0a0a] fixed h-screen top-0 left-0 border-r border-white/5 z-50 flex-col p-6 overflow-y-auto">
        <div className="flex flex-col items-center mb-10 mt-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Trend Optik" className="h-12 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
          ) : (
            <div className="flex flex-col items-start leading-tight select-none">
              <span className="text-xl font-extrabold tracking-wider text-[#ea580c] uppercase">Trend Optik</span>
              <span className="text-[10px] text-white/50 tracking-[0.22em] uppercase self-end -mt-1 pr-1">mersin</span>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-medium" 
                  : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER & MENU --- */}
      {/* Mobile Sticky Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Trend Optik" className="h-9 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
        ) : (
          <div className="flex flex-col items-start leading-tight select-none">
            <span className="text-base font-extrabold tracking-wider text-[#ea580c] uppercase">Trend Optik</span>
            <span className="text-[8px] text-white/50 tracking-[0.22em] uppercase self-end -mt-1 pr-0.5">mersin</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-white/75 hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Menüyü Aç"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Navigation (using AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] border-r border-white/5 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 mt-2">
                <span className="text-md font-semibold text-white/90">Yönetim Menüsü</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/50 hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 w-full overflow-y-auto pr-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-left ${
                        isActive 
                        ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-medium" 
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-red-400 bg-red-500/5 hover:bg-red-400/10 transition-colors border border-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
