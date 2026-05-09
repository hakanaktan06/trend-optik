"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const glassesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===================================
      // Premium Glasses Image — 3D Parallax on Scroll
      // ===================================
      if (glassesRef.current) {
        gsap.fromTo(
          glassesRef.current,
          {
            scale: 0.85,
            opacity: 0.4,
            y: 40,
          },
          {
            scale: 1.1,
            opacity: 1,
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // ===================================
      // Background Parallax — Slow zoom
      // ===================================
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1 },
          {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 2,
            },
          }
        );
      }

      // ===================================
      // Headline Parallax — Scroll ile yukarı kayma
      // ===================================
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -80,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "40% top",
            scrub: 1,
          },
        });
      }

      // ===================================
      // Subline Parallax — Daha yavaş kayma
      // ===================================
      if (sublineRef.current) {
        gsap.to(sublineRef.current, {
          y: -40,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "10% top",
            end: "50% top",
            scrub: 1,
          },
        });
      }

      // ===================================
      // Floating Particles Parallax
      // ===================================
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".particle");
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: -100 - i * 30,
            x: (i % 2 === 0 ? 1 : -1) * 50,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "60% top",
              scrub: 1 + i * 0.2,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[200vh] bg-[var(--background)]"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image — Cinematic */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/hero-bg.png"
            alt="Luxury atmosphere"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
            quality={90}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]/80" />
        </div>

        {/* Background Gradient Orb */}
        <div className="absolute inset-0 hero-gradient z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-[var(--accent-gold)] opacity-[0.02] blur-[150px] z-[1]" />

        {/* Floating Particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-[2]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="particle absolute rounded-full bg-[var(--accent-gold)]"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                opacity: 0.15 + (i * 0.04),
                width: `${2 + i * 0.5}px`,
                height: `${2 + i * 0.5}px`,
                filter: `blur(${i > 4 ? 1 : 0}px)`,
              }}
            />
          ))}
        </div>

        {/* Badge */}
        <motion.div
          ref={badgeRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 md:mb-10 z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-xs md:text-sm font-medium text-[var(--accent-gold)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
            Premium Gözlük Koleksiyonu 2025
          </div>
        </motion.div>

        {/* Headline */}
        <div ref={headlineRef} className="text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]"
          >
            Lüksü Yeniden
            <br />
            <span className="text-gradient-gold">Tanımlıyoruz</span>
          </motion.h1>
        </div>

        {/* Premium Glasses Image — Floating */}
        <motion.div
          ref={glassesRef}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] pointer-events-none z-[3]"
        >
          <div className="relative w-full h-full animate-float">
            <Image
              src="/hero-glasses.png"
              alt="Premium designer sunglasses"
              fill
              priority
              className="object-contain drop-shadow-[0_20px_60px_rgba(201,169,110,0.25)]"
              sizes="(max-width: 640px) 320px, (max-width: 768px) 450px, (max-width: 1024px) 600px, 700px"
              quality={95}
            />
            {/* Glow effect behind glasses */}
            <div className="absolute inset-0 -z-10 bg-[var(--accent-gold)] opacity-[0.06] blur-[80px] rounded-full scale-75" />
          </div>
        </motion.div>

        {/* Subline */}
        <div ref={sublineRef} className="text-center px-4 z-10 mt-6 md:mt-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/50 max-w-lg mx-auto font-light leading-relaxed"
          >
            Dünyanın en prestijli markalarından seçilmiş,
            <br className="hidden sm:block" />
            size özel gözlük koleksiyonları.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-10"
          >
            <a
              href="#koleksiyon"
              className="group px-7 py-3.5 text-sm font-medium text-[#050505] bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] rounded-full hover:shadow-xl hover:shadow-[var(--accent-gold)]/20 transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
            >
              Koleksiyonu Keşfet
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 text-sm font-medium text-white/70 hover:text-white rounded-full glass glass-hover transition-all duration-300"
            >
              WhatsApp İletişim
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">
            Kaydır
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-white/20" />
          </motion.div>
        </motion.div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-[4]" />
      </div>
    </section>
  );
}
