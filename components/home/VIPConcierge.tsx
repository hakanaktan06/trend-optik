"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function VIPConcierge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [step, setStep] = useState(1);

  return (
    <section ref={containerRef} id="concierge" className="py-32 relative bg-[var(--background)]">
      {/* Decorative lines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[var(--accent-gold)] text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
            >
              Kişisel Stil Asistanı
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
            >
              Size Özel <br/>
              <span className="text-white/40 font-light">Koleksiyon Sunumu</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-lg font-light leading-relaxed mb-10"
            >
              Trend Optik'te sıradan bir alışveriş yoktur. Yüz hatlarınıza, yaşam tarzınıza ve estetik zevkinize en uygun parçaları, mağazamızdaki özel VIP odamızda size özel bir sunumla keşfedin.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center border border-[var(--accent-gold)]/20">
                <span className="text-[var(--accent-gold)] text-xl">☕</span>
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Premium İkramlar</h4>
                <p className="text-white/40 text-sm font-light">Sunumunuz boyunca özel kahve ve içecek ikramı.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Form - Glassmorphic Concierge UI */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden"
          >
            {/* Ambient glow inside card */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-gold)] opacity-10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl text-white font-medium">VIP Sunum Randevusu</h3>
                <span className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full">
                  Adım {step}/3
                </span>
              </div>

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block text-sm text-white/50 font-light mb-4">Hangi tarz sizi daha iyi yansıtıyor?</label>
                  <div className="space-y-3 mb-8">
                    {["Minimalist & Titanyum", "Bold & Kalın Asetat", "Klasik & Zamansız", "Avangart Tasarımlar"].map((style, i) => (
                      <button key={i} onClick={() => setStep(2)} className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-[var(--accent-gold)]/50 hover:bg-white/5 transition-all duration-300 text-white font-light group flex justify-between items-center">
                        {style}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-gold)]">→</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm text-white/50 font-light mb-4">Ne arıyorsunuz?</label>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {["Güneş Gözlüğü", "Numaralı Çerçeve", "Özel Cam Yapımı", "Marka Danışmanlığı"].map((item, i) => (
                      <button key={i} onClick={() => setStep(3)} className="p-4 rounded-xl border border-white/10 hover:border-[var(--accent-gold)]/50 hover:bg-white/5 transition-all duration-300 text-white text-sm font-light text-center">
                        {item}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">← Geri</button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm text-white/50 font-light mb-4">İletişim Bilgileriniz</label>
                  <div className="space-y-4 mb-8">
                    <input type="text" placeholder="Adınız Soyadınız" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light" />
                    <input type="tel" placeholder="Telefon Numaranız" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light" />
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setStep(2)} className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">← Geri</button>
                    <button className="px-6 py-3 bg-[var(--accent-gold)] text-black text-sm font-medium rounded-full hover:bg-white transition-colors">Randevu Talebini İlet</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
