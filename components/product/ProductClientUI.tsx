"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, PackageX, X, ZoomIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/firestore-server";
import PremiumProductCard from "./PremiumProductCard";

interface ProductClientUIProps {
  product: Product;
  related: Product[];
  brandName: string;
}

/* Slide animation variants — direction 1=ileri(sağdan), -1=geri(soldan) */
const lbSlide = {
  enter: (d: number) => ({ x: d * 380, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -380, opacity: 0 }),
};

const imgSlide = {
  enter: (d: number) => ({ x: `${d * 55}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (d: number) => ({ x: `${d * -55}%`, opacity: 0 }),
};

function getTouchDist(touches: React.TouchList) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function ProductClientUI({ product, related, brandName }: ProductClientUIProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [mainDir, setMainDir] = useState(0);

  /* lightbox */
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbDir, setLbDir] = useState(0);

  /* pinch-to-zoom */
  const [scale, setScale] = useState(1);
  const pinchRef = useRef({ active: false, startDist: 0, startScale: 1 });
  const swipeStartX = useRef(0);

  const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];
  const isOutOfStock = product.stock <= 0;
  const whatsappLink = `https://wa.me/905312075818?text=${encodeURIComponent(
    `Merhaba, "${product.name} ${product.model}" ürünü hakkında bilgi almak istiyorum.\n\nÜrün Linki: https://trendoptikmersin.com/product/${product.id}`
  )}`;

  /* ── lightbox helpers ── */
  const openLb = (idx: number) => { setLbIdx(idx); setLbDir(0); setScale(1); setLbOpen(true); };
  const closeLb = useCallback(() => { setLbOpen(false); setScale(1); }, []);

  const prevLb = useCallback(() => {
    setLbDir(-1); setScale(1);
    setLbIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextLb = useCallback(() => {
    setLbDir(1); setScale(1);
    setLbIdx(i => (i + 1) % images.length);
  }, [images.length]);

  /* keyboard */
  useEffect(() => {
    if (!lbOpen) return;
    document.body.style.overflow = "hidden";
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") prevLb();
      if (e.key === "ArrowRight") nextLb();
    };
    window.addEventListener("keydown", fn);
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [lbOpen, closeLb, prevLb, nextLb]);

  /* ── touch handlers for lightbox ── */
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = { active: true, startDist: getTouchDist(e.touches), startScale: scale };
      return;
    }
    pinchRef.current.active = false;
    swipeStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current.active) {
      const ratio = getTouchDist(e.touches) / pinchRef.current.startDist;
      setScale(Math.max(1, Math.min(4, pinchRef.current.startScale * ratio)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (pinchRef.current.active) {
      pinchRef.current.active = false;
      if (scale < 1.15) setScale(1);
      return;
    }
    if (scale > 1.1) return; /* don't swipe while zoomed */
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    if (Math.abs(dx) > 55) dx < 0 ? nextLb() : prevLb();
  };

  /* main image thumbnail click with direction */
  const selectImage = (idx: number) => {
    setMainDir(idx > activeImage ? 1 : -1);
    setActiveImage(idx);
  };

  return (
    <div className="container-premium relative">

      {/* ══════════ LIGHTBOX ══════════ */}
      <AnimatePresence>
        {lbOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/97 flex flex-col select-none"
            style={{ touchAction: "none" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Header */}
            <div className="flex-shrink-0 h-14 flex items-center justify-between px-4 z-20 pointer-events-none">
              <span className="text-white/35 text-[11px] font-mono tracking-[0.2em]">
                {images.length > 1 ? `${lbIdx + 1} / ${images.length}` : ""}
              </span>
              <button
                className="pointer-events-auto w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={closeLb}
              >
                <X size={17} />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 relative overflow-hidden">
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevLb(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextLb(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait" custom={lbDir}>
                <motion.div
                  key={lbIdx}
                  custom={lbDir}
                  variants={lbSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setScale(s => s > 1 ? 1 : 2.2); }}
                  style={{ cursor: scale > 1 ? "zoom-out" : "zoom-in" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[lbIdx]}
                    alt={`${product.name} ${lbIdx + 1}`}
                    draggable={false}
                    style={{
                      maxHeight: "calc(100vh - 3.5rem)",
                      maxWidth: "92%",
                      width: "auto",
                      height: "auto",
                      display: "block",
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                      transition: pinchRef.current.active ? "none" : "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
                      willChange: "transform",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scale hint */}
            {scale > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono tracking-widest">
                {Math.round(scale * 10) / 10}×
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ PAGE ══════════ */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-gold)] group-hover:text-[var(--accent-gold)] transition-all bg-white/5">
          <ChevronLeft size={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Geri Dön</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">
        {/* ── Görsel Galerisi ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 relative flex flex-col gap-4"
        >
          {/* Ana görsel — tıklayınca lightbox */}
          <div
            className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 cursor-zoom-in group/img"
            onClick={() => openLb(activeImage)}
          >
            <AnimatePresence mode="wait" custom={mainDir}>
              <motion.div
                key={activeImage}
                custom={mainDir}
                variants={imgSlide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeImage]}
                  alt={`${brandName} ${product.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
              <ZoomIn size={14} className="text-white/70" />
            </div>

            {product.isFeatured && (
              <div className="absolute top-2 left-2 z-20">
                <div className="px-2.5 py-1 rounded-full bg-black/70 border border-[var(--accent-gold)]/25 backdrop-blur-sm">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">Trend Ürün</span>
                </div>
              </div>
            )}
          </div>

          {/* Küçük resimler */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => selectImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                    activeImage === idx
                      ? "border-[var(--accent-gold)] opacity-100 scale-105"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Ürün Detayları ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6 flex flex-col"
        >
          <div className="mb-8">
            <span className="text-[var(--accent-gold)] text-xs tracking-[0.4em] uppercase mb-4 block font-mono font-bold">
              {brandName}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="text-lg text-white/50 tracking-wider mb-6 font-mono">
              Model: <span className="text-white font-medium">{product.model}</span>
            </div>

            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <PackageX className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Stokta Yok / Yakında</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Stokta Mevcut</span>
              </div>
            )}
          </div>

          <div className="space-y-6 md:space-y-8 mb-10">
            <p className="text-white/60 font-light leading-relaxed text-base md:text-lg">
              {product.description ||
                "Zarafetin ve kalitenin buluştuğu bu özel tasarım, göz sağlığınızı korurken stilinize eşsiz bir dokunuş katıyor. En yüksek kalite materyallerle üretilmiştir."}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: ShieldCheck, title: "%100 UV Korumalı Orijinal Camlar", desc: "Tüm ürünlerimiz distribütör garantilidir." },
                { icon: Truck, title: "Ücretsiz ve Güvenli Kargo", desc: "Özenle paketlenip kapınıza teslim edilir." },
                { icon: RotateCcw, title: "Müşteri Memnuniyeti", desc: "14 gün içerisinde kolay iade ve değişim." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-white/[0.02] transition-colors border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[var(--accent-gold)]" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold tracking-wide">{title}</h4>
                    <p className="text-white/40 text-xs mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {isOutOfStock && (
              <p className="text-[10px] text-white/40 tracking-widest uppercase mb-3 px-1 text-center sm:text-left">
                Bu ürün geçici olarak temin edilemiyor, ancak ön sipariş için bilgi alabilirsiniz.
              </p>
            )}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => import("@/lib/analytics").then((m) => m.trackWhatsAppLead(product.name))}
              className="w-full bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black py-5 md:py-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[var(--accent-gold)]/20 text-lg uppercase tracking-wider"
            >
              <MessageCircle size={24} />
              WhatsApp İle Bilgi Al
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Benzer Ürünler ── */}
      {related.length > 0 && (
        <div className="mt-32 border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Benzer <span className="text-white/20 italic font-display">Modeller</span>
            </h3>
            <Link
              href={`/marka/${product.brandId}`}
              className="text-xs text-[var(--accent-gold)] font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
            >
              Tüm {brandName} Modelleri <span>&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <PremiumProductCard key={item.id} product={item} brandName={brandName} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
