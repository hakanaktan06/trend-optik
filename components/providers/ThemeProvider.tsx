"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ThemeContextType {
  activeTheme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState("standard");

  useEffect(() => {
    // Real-time listener for the theme settings in Firestore
    const unsubscribe = onSnapshot(doc(db, "settings", "theme"), (docSnap) => {
      if (docSnap.exists()) {
        const theme = docSnap.data().activeTheme || "standard";
        setActiveTheme(theme);
        
        // Update the HTML data-theme attribute
        document.documentElement.setAttribute("data-theme", theme);
        
        // Add a smooth transition class if needed
        document.documentElement.style.transition = "all 1s ease";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme }}>
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
}
