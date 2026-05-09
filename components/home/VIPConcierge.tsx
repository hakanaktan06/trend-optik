"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function VIPConcierge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [step, setStep] = useState(1);
  
  // Form State
  const [style, setStyle] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Submit State
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !phone) {
      setError("Lütfen adınızı ve telefon numaranızı girin.");
      return;
    }
    setError("");
    setSubmitting(true);
    
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, style, type }),
      });
      
      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (e) {
      setError("Bağlantı hatası. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} id="concierge" className="py-16 md:py-32 relative bg-[var(--background)]">
      {/* Decorative lines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-xl px-4 md:px-0">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[var(--accent-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
            >
              Kişisel Stil Asistanı
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tighter leading-tight"
            >
              Size Özel <br/>
              <span className="text-white/40 font-light">Koleksiyon Sunumu</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-10"
            >
              Trend Optik'te sıradan bir alışveriş yoktur. Yüz hatlarınıza, yaşam tarzınıza ve estetik zevkinize en uygun parçaları, mağazamızdaki özel VIP odamızda size özel bir sunumla keşfedin.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/[0.03] backdrop-blur-md flex items-center justify-center border border-white/[0.05]">
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
            className="rounded-[2rem] bg-white/[0.03] border border-white/[0.05] backdrop-blur-md p-8 md:p-12 relative overflow-hidden"
          >
            {/* Ambient glow inside card */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-gold)] opacity-10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 px-2 md:px-0">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg md:text-xl text-white font-medium">VIP Sunum Randevusu</h3>
                {!success && (
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                    Adım {step}/3
                  </span>
                )}
              </div>

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block text-sm text-white/50 font-light mb-4">Hangi tarz sizi daha iyi yansıtıyor?</label>
                  <div className="space-y-3 mb-8">
                    {["Minimalist & Titanyum", "Bold & Kalın Asetat", "Klasik & Zamansız", "Avangart Tasarımlar"].map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setStyle(s); setStep(2); }} 
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 text-white font-light group flex justify-between items-center ${style === s ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10' : 'border-white/10 hover:border-[var(--accent-gold)]/50 hover:bg-white/5'}`}
                      >
                        {s}
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
                    {["Güneş Gözlüğü", "Numaralı Çerçeve", "Özel Cam Yapımı", "Marka Danışmanlığı"].map((t, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setType(t); setStep(3); }} 
                        className={`p-4 rounded-xl border transition-all duration-300 text-white text-sm font-light text-center ${type === t ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10' : 'border-white/10 hover:border-[var(--accent-gold)]/50 hover:bg-white/5'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">← Geri</button>
                </motion.div>
              )}

              {step === 3 && !success && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm text-white/50 font-light mb-4">İletişim Bilgileriniz</label>
                  <div className="space-y-4 mb-6">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon Numaranız" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light" />
                  </div>
                  
                  {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
                  
                  <div className="flex items-center justify-between">
                    <button onClick={() => setStep(2)} className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">← Geri</button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={submitting}
                      className="px-6 py-3 bg-[var(--accent-gold)] text-black text-sm font-medium rounded-full hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Randevu Talebini İlet"}
                    </button>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Talebiniz Alındı</h4>
                  <p className="text-white/40 font-light text-sm mb-8">
                    {name}, stil danışmanlarımız en kısa sürede sizinle iletişime geçerek VIP randevunuzu planlayacaktır.
                  </p>
                  <button 
                    onClick={() => { setSuccess(false); setStep(1); setName(""); setPhone(""); setStyle(""); setType(""); }}
                    className="text-[10px] text-[var(--accent-gold)] uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Yeni Talep Oluştur
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
