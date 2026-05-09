"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const glassesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===================================
      // 3D Glasses Rotation on Scroll
      // Apple AirPods tarzı scroll-driven
      // ===================================
      if (glassesRef.current) {
        gsap.fromTo(
          glassesRef.current,
          {
            rotateY: -30,
            rotateX: 15,
            scale: 0.8,
            opacity: 0.3,
          },
          {
            rotateY: 30,
            rotateX: -5,
            scale: 1,
            opacity: 1,
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

      // ===================================
      // Canvas Frame Animation Setup
      // (Gerçek frame'ler eklendiğinde aktif edilecek)
      // ===================================
      /*
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        const frameCount = 60;
        const images: HTMLImageElement[] = [];
        
        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          img.src = `/frames/glasses_${i.toString().padStart(4, '0')}.webp`;
          images.push(img);
        }

        const render = (index: number) => {
          if (context && images[index]?.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
          }
        };

        const obj = { frame: 0 };
        gsap.to(obj, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
          onUpdate: () => render(Math.round(obj.frame)),
        });

        images[0].onload = () => render(0);
      }
      */
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
        {/* Background Gradient Orb */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-[var(--accent-gold)] opacity-[0.015] blur-[150px]" />

        {/* Floating Particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 rounded-full bg-[var(--accent-gold)]"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                opacity: 0.2 + (i * 0.05),
                width: `${2 + i}px`,
                height: `${2 + i}px`,
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
          className="mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-medium text-[var(--accent-gold)] tracking-wide">
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

        {/* Subline */}
        <div ref={sublineRef} className="text-center px-4 z-10 mt-6 md:mt-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/40 max-w-lg mx-auto font-light leading-relaxed"
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

        {/* 3D Glasses Element — Placeholder */}
        <div
          ref={glassesRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[550px] md:h-[550px] pointer-events-none"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {/* SVG Glasses Silhouette */}
          <svg
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-10"
            style={{ filter: "drop-shadow(0 0 60px rgba(201, 169, 110, 0.15))" }}
          >
            {/* Left Lens */}
            <ellipse cx="250" cy="200" rx="160" ry="130" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
            {/* Right Lens */}
            <ellipse cx="550" cy="200" rx="160" ry="130" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
            {/* Bridge */}
            <path d="M390 200 C400 170 400 170 410 200" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
            {/* Left Temple */}
            <path d="M90 170 C50 165 20 160 5 155" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Right Temple */}
            <path d="M710 170 C750 165 780 160 795 155" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Lens Reflection — Premium Touch */}
            <ellipse cx="230" cy="180" rx="60" ry="40" fill="url(#lensReflect)" opacity="0.3" />
            <ellipse cx="530" cy="180" rx="60" ry="40" fill="url(#lensReflect)" opacity="0.3" />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="800" y2="400">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#c9a96e" />
                <stop offset="100%" stopColor="#b8941f" />
              </linearGradient>
              <radialGradient id="lensReflect" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Hidden Canvas for future frame animation */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none hidden"
        />

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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>
    </section>
  );
}
