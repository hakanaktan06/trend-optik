"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export default function LensTech() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <section ref={containerRef} className="py-16 md:py-32 relative bg-[var(--background-secondary)] overflow-hidden">
      <div className="container-premium">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="max-w-xl order-2 lg:order-1 px-4 md:px-0">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[var(--accent-gold)] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-medium"
            >
              Alman Mühendisliği
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tighter leading-tight"
            >
              Kusursuz Netlik, <br/>
              <span className="text-white/40 font-light">Sıfır Yansıma</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-8"
            >
              Dünyanın önde gelen optik üreticilerinin (Zeiss, Leica) son teknoloji camları ile tanışın. Geleneksel camlardaki parlama, bulanıklık ve yorgunluk hissine veda edin. Dünyayı 8K çözünürlükte görüyormuş gibi hissedeceksiniz.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              <div>
                <h4 className="text-[var(--accent-gold)] font-bold text-xl md:text-2xl mb-1">%99.9</h4>
                <p className="text-white/40 text-[10px] md:text-sm font-light uppercase tracking-widest">Yansıma Engelleyici</p>
              </div>
              <div>
                <h4 className="text-[var(--accent-gold)] font-bold text-xl md:text-2xl mb-1">%40</h4>
                <p className="text-white/40 text-[10px] md:text-sm font-light uppercase tracking-widest">Daha İnce ve Hafif</p>
              </div>
            </motion.div>
          </div>

          {/* Right Slider - Interaction */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 w-full h-[350px] md:h-[500px] rounded-[2rem] overflow-hidden relative cursor-ew-resize border border-white/10"
            ref={sliderRef}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
          >
            {/* Base Image (Standard Lens - Blurry/Glare) */}
            <div className="absolute inset-0 bg-stone-900 overflow-hidden">
              <div 
                className="absolute inset-0 bg-[url('/images/coastal-drive.png')] bg-cover bg-center scale-[1.05]"
                style={{ filter: "blur(4px) brightness(1.3) contrast(0.8) saturate(0.6)" }}
              />
              {/* Fake sun glare overlay */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/40 via-transparent to-transparent mix-blend-overlay" />
              <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 z-10">
                <span className="text-white/80 text-xs tracking-widest uppercase font-semibold">Standart Cam</span>
              </div>
            </div>

            {/* Top Image (Premium Lens - Sharp/Clear) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div 
                className="absolute inset-0 bg-[url('/images/coastal-drive.png')] bg-cover bg-center scale-[1.05]"
                style={{ filter: "contrast(1.1) saturate(1.2)" }}
              />
              <div className="absolute top-6 left-6 bg-[var(--accent-gold)]/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--accent-gold)]/50 z-10 shadow-[0_0_15px_rgba(201,169,110,0.2)]">
                <span className="text-[var(--accent-gold)] text-xs tracking-widest uppercase font-bold drop-shadow-md">Premium ZEISS Cam</span>
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="w-6 h-6 flex justify-between items-center px-1">
                  <div className="w-0.5 h-3 bg-black/30 rounded-full" />
                  <div className="w-0.5 h-3 bg-black/30 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
