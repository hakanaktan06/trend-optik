"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/firestore-server";

export default function PremiumProductCard({ product, brandName }: { product: Product, brandName: string }) {
  const isOutOfStock = product.stock <= 0;
  const primaryImage = product.images?.[0] || "/placeholder.png";

  const waMessage = encodeURIComponent(`Merhaba, "${product.name} ${product.model}" ürünü hakkında bilgi almak istiyorum.\n\nÜrün Linki: https://trendoptikmersin.com/product/${product.id}`);
  const waLink = `https://wa.me/905312075818?text=${waMessage}`;

  return (
    <div className="group flex flex-col glass p-2 sm:p-3 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/5 hover:border-[var(--accent-gold)]/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] transition-all duration-700 hover:bg-white/[0.04] h-full">
      {/* Image Wrapper */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/5] w-full rounded-xl sm:rounded-[2rem] overflow-hidden mb-3 sm:mb-6 bg-[#241F18] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none"></div>
        <Image 
          src={primaryImage} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Premium Badge */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 z-20">
            <div className="px-2 py-0.5 rounded-full bg-black/70 border border-[var(--accent-gold)]/50 backdrop-blur-sm">
              <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)]">Trend</span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="px-1 sm:px-4 pb-2 sm:pb-4 flex flex-col flex-grow">
        <span className="text-[var(--accent-gold)] text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 sm:mb-2 font-mono font-bold block">{brandName}</span>
        <h3 className="text-sm sm:text-xl font-display font-bold text-white mb-0.5 sm:mb-1 leading-tight group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-[10px] sm:text-xs text-[#9AA7AE] font-mono line-clamp-1 tracking-wider">{product.model}</p>
        {isOutOfStock && (
          <span className="mt-1.5 sm:mt-2 inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-red-400/80">
            Stokta Yok
          </span>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5">
          <Link 
            href={`/product/${product.id}`}
            className="flex-1 py-3 min-h-[44px] flex items-center justify-center rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center transition-all"
          >
            İncele
          </Link>
          <div className="w-2 sm:w-3"></div>
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              import("@/lib/analytics").then((m) => m.trackWhatsAppLead(product.name));
            }}
            className="flex-1 py-3 min-h-[44px] rounded-lg sm:rounded-xl bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
          >
            Bilgi Al
          </a>
        </div>
      </div>
    </div>
  );
}
