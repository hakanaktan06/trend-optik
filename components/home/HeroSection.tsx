"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth parallax for the background video
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleVideoEnded = () => {
    // 10 saniye bekle ve tekrar oynat
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 10000);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[var(--background)]"
    >
      {/* Parallax Video Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover"
        >
          {/* Mobile Video (9:16 aspect ratio, cropped via FFmpeg) */}
          <source src="/hero-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          {/* Desktop Video (Standard Landscape) */}
          <source src="/hero-new.mp4" type="video/mp4" />
        </video>
        {/* Advanced Gradient Overlay for Premium Look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[var(--background)]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/80 pointer-events-none" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 sm:px-6">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full glass text-[10px] sm:text-xs font-medium text-[var(--accent-color)] tracking-widest uppercase backdrop-blur-md border border-[var(--accent-color)]/20 shadow-lg shadow-[var(--accent-color)]/10">
            Premium Koleksiyon '25
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.95] sm:leading-[0.9]"
          >
            Lüksü Yeniden
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent-light)] to-[var(--accent-color)]">
              Tanımlıyoruz
            </span>
          </motion.h1>
        </div>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-6 sm:mt-8 text-sm sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto text-center font-light leading-relaxed"
        >
          Dünyanın en prestijli markalarından seçilmiş,
          <br className="hidden sm:block" />
          size özel gözlük koleksiyonları.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#koleksiyon"
            className="group relative px-8 py-3.5 sm:py-4 bg-white text-black text-sm md:text-base font-semibold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Koleksiyonu Keşfet</span>
            <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">
            Kaydır
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-white/40" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom Fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
