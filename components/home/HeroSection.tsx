"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 121;

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;
  let dw: number, dh: number, dx: number, dy: number;
  if (ir > cr) {
    dh = ch;
    dw = ch * ir;
    dx = (cw - dw) / 2;
    dy = 0;
  } else {
    dw = cw;
    dh = cw / ir;
    dx = 0;
    dy = (ch - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));
  const currentFrameRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Desktop: frame scrubbing
  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas buffer to exact viewport — eliminates distortion
    const syncCanvasSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // Redraw current frame after resize
        const img = imagesRef.current[currentFrameRef.current];
        if (img?.complete) {
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) drawCover(ctx, img, w, h);
        }
      }
    };

    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const images = imagesRef.current;
    let loadedCount = 0;

    const loadImages = async () => {
      for (let i = 1; i <= FRAME_COUNT; i += 10) {
        const batch: Promise<unknown>[] = [];
        for (let j = 0; j < 10 && i + j <= FRAME_COUNT; j++) {
          const index = i + j;
          const img = new Image();
          const padded = index.toString().padStart(4, "0");
          img.src = `/frames/frame_${padded}.jpg`;
          batch.push(
            new Promise((resolve) => {
              img.onload = () => {
                images[index - 1] = img;
                loadedCount++;
                resolve(true);
              };
              img.onerror = () => resolve(false);
            })
          );
        }
        await Promise.all(batch);
      }
    };

    loadImages();

    // Draw first frame as soon as it arrives
    const drawInitial = setInterval(() => {
      if (images[0]?.complete) {
        drawCover(context, images[0], canvas.width, canvas.height);
        clearInterval(drawInitial);
      }
    }, 50);

    const ctx = gsap.context(() => {
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

      const playhead = { frame: 0 };
      let rafPending = false;

      const render = () => {
        const idx = Math.round(playhead.frame);
        currentFrameRef.current = idx;
        const img = images[idx];
        if (img?.complete) {
          drawCover(context, img, canvas.width, canvas.height);
        }
        rafPending = false;
      };

      gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
        onUpdate: () => {
          if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(render);
          }
        },
      });
    }, sectionRef);

    return () => {
      clearInterval(drawInitial);
      window.removeEventListener("resize", syncCanvasSize);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[300vh] bg-[var(--background)]"
    >
      <div className="sticky top-0 h-[100svh] flex flex-col items-center justify-center overflow-hidden">

        {/* Mobile: direct video (no frame loading) */}
        {isMobile && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]"
          >
            <source src="/hero-new.mp4" type="video/mp4" />
          </video>
        )}

        {/* Desktop: scroll-scrubbed canvas */}
        {!isMobile && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--background)]/90 z-[2]" />

        {/* Badge */}
        <motion.div
          ref={badgeRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 md:mb-10 z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-[10px] md:text-sm font-medium text-[var(--accent-color)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] animate-pulse" />
            Premium Gözlük Koleksiyonu 2025
          </div>
        </motion.div>

        {/* Headline */}
        <div ref={headlineRef} className="text-center px-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95]"
          >
            Lüksü Yeniden
            <br />
            <span className="text-gradient-aura">Tanımlıyoruz</span>
          </motion.h1>
        </div>

        {/* Subline & CTA */}
        <div ref={sublineRef} className="text-center px-6 z-10 mt-6 md:mt-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-lg text-white/60 max-w-lg mx-auto font-light leading-relaxed"
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
              className="group px-7 py-3.5 text-sm font-medium text-black bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-color)] rounded-full hover:shadow-xl hover:shadow-[var(--accent-color)]/20 transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
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
