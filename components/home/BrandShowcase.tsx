"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const brands = [
  "Ray-Ban",
  "Gucci",
  "Prada",
  "Tom Ford",
  "Cartier",
  "Versace",
  "Dolce & Gabbana",
  "Burberry",
  "Dior",
  "Saint Laurent",
  "Chanel",
  "Oakley",
];

export default function BrandShowcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="markalar"
      ref={ref}
      className="relative py-[var(--section-padding)] bg-[var(--background-secondary)] overflow-hidden"
    >
      <div className="container-premium relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-4"
          >
            Markalarımız
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            Dünyadan{" "}
            <span className="text-gradient-gold">Seçkin</span> Markalar
          </motion.h2>
        </div>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[var(--background-secondary)] to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
          className="flex overflow-hidden"
        >
          <div className="flex animate-scroll-left gap-8 md:gap-12 items-center min-w-max">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex-shrink-0 px-6 md:px-8 py-4 md:py-5 rounded-2xl glass group hover:border-[var(--border-gold)] transition-all duration-500 cursor-default"
              >
                <span className="text-lg md:text-xl font-semibold text-white/20 group-hover:text-[var(--accent-gold)] transition-colors duration-500 tracking-tight whitespace-nowrap">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Second Row — Reverse Direction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex overflow-hidden mt-4"
        >
          <div
            className="flex gap-8 md:gap-12 items-center min-w-max"
            style={{
              animation: "scrollLeft 35s linear infinite reverse",
            }}
          >
            {[...brands.slice().reverse(), ...brands.slice().reverse()].map(
              (brand, i) => (
                <div
                  key={`${brand}-rev-${i}`}
                  className="flex-shrink-0 px-6 md:px-8 py-4 md:py-5 rounded-2xl glass group hover:border-[var(--border-gold)] transition-all duration-500 cursor-default"
                >
                  <span className="text-lg md:text-xl font-semibold text-white/15 group-hover:text-[var(--accent-gold)] transition-colors duration-500 tracking-tight whitespace-nowrap">
                    {brand}
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <div className="container-premium mt-16 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { value: "50+", label: "Marka" },
            { value: "10K+", label: "Mutlu Müşteri" },
            { value: "15+", label: "Yıllık Deneyim" },
            { value: "%100", label: "Orijinal Ürün" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-5 md:p-6 rounded-2xl glass"
            >
              <div className="text-2xl md:text-3xl font-bold text-gradient-gold tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/30 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
