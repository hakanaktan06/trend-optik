"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function TheVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);

  const handlePointerDown = () => {
    if (isUnlocked) return;
    
    // Simulate unlocking mechanism
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setUnlockProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUnlocked(true);
      }
    }, 20);

    const handlePointerUp = () => {
      clearInterval(interval);
      if (progress < 100) {
        setUnlockProgress(0); // Reset if let go too early
      }
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section ref={containerRef} className="py-32 relative bg-[#020202] overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-widest uppercase"
          >
            The Vault
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 text-lg font-light max-w-lg mx-auto"
          >
            Dünya çapında sadece sınırlı sayıda üretilmiş, markaların ikonik ve gizli koleksiyonları.
          </motion.p>
        </div>

        {/* The Vault Container */}
        <div className="relative max-w-5xl mx-auto h-[600px] rounded-3xl border border-white/5 bg-[#050505] overflow-hidden flex items-center justify-center">
          
          {!isUnlocked ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-center z-20 flex flex-col items-center"
            >
              <div className="mb-8 relative w-32 h-32 flex items-center justify-center">
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="var(--accent-gold)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * unlockProgress) / 100}
                    className="transition-all duration-75 ease-linear"
                  />
                </svg>
                
                <button 
                  onPointerDown={handlePointerDown}
                  className="w-24 h-24 rounded-full bg-black border border-white/10 hover:border-[var(--accent-gold)]/50 transition-colors flex items-center justify-center text-white/50 hover:text-[var(--accent-gold)] active:scale-95"
                >
                  <span className="text-sm tracking-widest uppercase">Basılı Tut</span>
                </button>
              </div>
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase">Koleksiyonu Açmak İçin Parmak İzi Onayı</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full p-8 md:p-12"
            >
              {/* Vault Content Revealed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              
              <div className="relative z-20 h-full flex flex-col justify-end pb-8">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[var(--accent-gold)] text-xs tracking-[0.3em] uppercase mb-3 block"
                >
                  Sınırlı Üretim: 1/150
                </motion.span>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-4"
                >
                  Cartier Premiere <br/>
                  <span className="font-light text-white/50">Edition</span>
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-white/40 max-w-md font-light leading-relaxed mb-8"
                >
                  Sadece seçkin butiklerde yer alan bu özel seri, el işçiliği platinyum detaylarıyla zamana meydan okuyor.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="w-max px-8 py-4 bg-white text-black text-sm font-medium rounded-full hover:bg-[var(--accent-gold)] transition-colors"
                >
                  Özel Randevu Talep Et
                </motion.button>
              </div>

              {/* Decorative luxury item outline (since we don't have images) */}
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 md:left-2/3 -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] opacity-20 pointer-events-none"
              >
                <div className="w-full h-full rounded-full border border-[var(--accent-gold)] opacity-30 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-[var(--accent-gold)] opacity-10 animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent-gold)] text-opacity-10 text-9xl">
                  ✧
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Locked Overlay Texture */}
          {!isUnlocked && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
}
