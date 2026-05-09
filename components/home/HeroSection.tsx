"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 240;

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    // 1. Preload images for buttery smooth scrolling
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(4, "0");
      img.src = `/frames/frame_${paddedIndex}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImagesPreloaded(true);
        }
      };
      images.push(img);
    }

    // 2. Setup GSAP Canvas Scrubbing
    const ctx = gsap.context(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Draw first frame immediately once loaded
      if (images[0]) {
        images[0].onload = () => {
          context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
        };
      }

      // Parallax text animations
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -120,
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

      if (sublineRef.current) {
        gsap.to(sublineRef.current, {
          y: -60,
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

      // The Magic Frame Scrubber
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top", // section is 300vh, gives lots of scroll space
        scrub: 0.5, // 0.5s smoothing
        onUpdate: (self) => {
          // Progress from 0 to 1 -> map to frame 0 to 239
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.floor(self.progress * FRAME_COUNT))
          );
          
          if (images[frameIndex] && images[frameIndex].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
          }
        },
      });

      // Canvas Scale/Parallax effect
      gsap.fromTo(
        canvas,
        { scale: 0.85, y: 50, opacity: 0 },
        {
          scale: 1.15,
          y: -50,
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

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[300vh] bg-[var(--background)]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle Background Gradient to blend with video background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background-secondary)]/5 to-[var(--background)]/90 z-[1]" />
        
        {/* Apple-style Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-[16/9] sm:aspect-video pointer-events-none z-[2] flex items-center justify-center mix-blend-screen">
          <canvas
            ref={canvasRef}
            width={1080}
            height={608}
            className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          />
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

        {/* Subline & CTA */}
        <div ref={sublineRef} className="text-center px-4 z-10 mt-6 md:mt-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-lg mx-auto font-light leading-relaxed"
          >
            Dünyanın en prestijli markalarından seçilmiş,
            <br className="hidden sm:block" />
            size özel gözlük koleksiyonları.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-10 pointer-events-auto"
          >
            <a
              href="#koleksiyon"
              className="group px-7 py-3.5 text-sm font-medium text-[#050505] bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] rounded-full hover:shadow-xl hover:shadow-[var(--accent-gold)]/20 transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
            >
              Koleksiyonu Keşfet
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
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

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-[4]" />
      </div>
    </section>
  );
}
