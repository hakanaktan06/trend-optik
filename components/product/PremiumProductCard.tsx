import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/firestore-server";

export default function PremiumProductCard({ product, brandName }: { product: Product, brandName: string }) {
  const isOutOfStock = product.stock <= 0;
  const primaryImage = product.images?.[0] || "/placeholder.png";

  const waMessage = encodeURIComponent(`Merhaba, "${product.name} ${product.model}" ürünü hakkında bilgi almak istiyorum.\n\nGörsel: ${primaryImage}\nÜrün Linki: https://trendoptikmersin.com/product/${product.id}`);
  const waLink = `https://wa.me/905312075818?text=${waMessage}`;

  return (
    <div className="group flex flex-col glass p-3 rounded-[2.5rem] border border-white/5 hover:border-[var(--accent-gold)]/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] transition-all duration-700 hover:bg-white/[0.04]">
      {/* Image Wrapper */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-6 bg-white/5 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none"></div>
        <Image 
          src={primaryImage} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
            <span className="px-5 py-2 bg-black text-white/90 text-xs font-bold tracking-[0.3em] uppercase rounded-full border border-white/20 shadow-2xl">
              Stokta Yok
            </span>
          </div>
        )}
        
        {/* Premium Badge */}
        {product.isFeatured && (
          <div className="absolute top-4 left-4 z-20">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--accent-gold)]/30 to-black/40 border border-[var(--accent-gold)]/40 backdrop-blur-md shadow-lg">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent-gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">Trend Ürün</span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pb-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-[var(--accent-gold)] transition-colors duration-500 font-bold mb-3">
          {brandName}
        </div>
        
        <Link href={`/product/${product.id}`} className="block mb-6 flex-1">
          <h3 className="text-2xl font-light tracking-tight text-white group-hover:text-[var(--accent-gold)] transition-colors duration-500">
            {product.name}
          </h3>
          {product.model && <p className="text-sm font-light text-white/30 mt-2">{product.model}</p>}
        </Link>

        {/* Footer / Actions */}
        <div className="mt-auto flex items-center gap-3">
          <Link 
            href={`/product/${product.id}`}
            className="flex-1 py-3.5 text-center text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/5"
          >
            İncele
          </Link>
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 text-center text-[11px] font-extrabold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] shadow-[0_0_20px_rgba(212,175,55,0.3)] rounded-2xl transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            Bilgi Al
          </a>
        </div>
      </div>
    </div>
  );
}
