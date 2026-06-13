"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STORAGE_KEY = "trend-optik-theme";
const LOGO_KEY = "trend-optik-logo";

interface ThemeContextType {
  activeTheme: string;
  logoUrl: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === "undefined") return "standard";
    return localStorage.getItem(STORAGE_KEY) || "standard";
  });
  const [logoUrl, setLogoUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(LOGO_KEY) || "";
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "theme"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const theme = data.activeTheme || "standard";
        if (theme !== activeTheme) {
          document.documentElement.style.transition = "color 0.4s ease, background-color 0.4s ease";
        }
        setActiveTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}

        const url = data.logoUrl || "";
        setLogoUrl(url);
        try {
          if (url) localStorage.setItem(LOGO_KEY, url);
          else localStorage.removeItem(LOGO_KEY);
        } catch (_) {}
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, logoUrl }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
