"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or denied
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Default to denied
      window.gtag?.("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
      setShow(true);
    } else if (consent === "granted") {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "granted");
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
    });
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "denied");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none flex justify-center"
        >
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 shadow-2xl pointer-events-auto">
            <div className="flex-1 text-sm text-white/70 font-light leading-relaxed">
              <span className="font-semibold text-white block mb-1">Çerez Tercihleri</span>
              Sitemizde, deneyiminizi geliştirmek ve trafiğimizi analiz etmek için çerezler kullanılmaktadır. 
              Daha fazla bilgi için <a href="#" className="text-[var(--accent-gold)] hover:underline">Gizlilik Politikamızı</a> inceleyebilirsiniz.
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={decline}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 text-sm font-medium transition-colors"
              >
                Reddet
              </button>
              <button 
                onClick={accept}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black text-sm font-bold transition-colors"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
