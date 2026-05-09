"use client";

import { LayoutGrid, Glasses, Target, Box, Award, Eye, LogOut, Send } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Ana Ekran", icon: LayoutGrid },
    { id: "products", label: "Ürün Vitrini", icon: Glasses },
    { id: "radar", label: "Akıllı Radar", icon: Target },
    { id: "orders", label: "Siparişler", icon: Box },
    { id: "certs", label: "Sertifikalar", icon: Award },
    { id: "lenses", label: "Lens Radarı", icon: Eye },
    { id: "telegram", label: "Telegram Ayarları", icon: Send },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0a0a0a] lg:fixed lg:h-screen lg:top-0 lg:left-0 border-b lg:border-b-0 lg:border-r border-white/5 z-50 flex flex-row lg:flex-col p-4 lg:p-6 overflow-x-auto lg:overflow-x-hidden scrollbar-hide">
      
      <div className="hidden lg:block text-center mb-10 mt-4">
        <h1 className="text-xl font-bold tracking-wider text-white">
          <span className="text-[var(--accent-gold)]">Trend Optik</span> Mersin.
        </h1>
      </div>

      <nav className="flex lg:flex-col gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
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

      <div className="mt-auto hidden lg:block pt-8 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
      
      {/* Mobile Logout (appended to end of row) */}
      <div className="lg:hidden ml-2 border-l border-white/10 pl-2">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors whitespace-nowrap"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış</span>
        </button>
      </div>

    </aside>
  );
}
