"use client";

import { motion } from "framer-motion";

export default function ParallaxBanner() {
  return (
    <section className="relative min-h-[70svh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ 
          backgroundImage: "url('/images/parallax-model.jpg')",
          backgroundAttachment: "fixed" // CSS Parallax effect
        }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-[0.2em] uppercase mb-4">
            KARAKTERİNİZİ <span className="text-white/30">TANIMLAYIN</span>
          </h2>
          <div className="w-24 h-px bg-[var(--accent-gold)] mx-auto mb-8" />
          <p className="text-[var(--accent-gold)] text-sm md:text-lg tracking-[0.4em] uppercase font-light">
            Trend Optik Exclusive Collection
          </p>
        </motion.div>
      </div>
    </section>
  );
}
