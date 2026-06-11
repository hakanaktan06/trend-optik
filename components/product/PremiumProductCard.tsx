import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/firestore-server";

export default function PremiumProductCard({ product, brandName }: { product: Product, brandName: string }) {
  const isOutOfStock = product.stock <= 0;
  const primaryImage = product.images?.[0] || "/placeholder.png";

  const waMessage = encodeURIComponent(`Merhaba, "${brandName} ${product.model} - ${product.name}" ürünü hakkında bilgi almak istiyorum. (https://trendoptikmersin.com/product/${product.id})`);
  const waLink = `https://wa.me/905312075818?text=${waMessage}`;

  return (
    <div className="group flex flex-col glass p-4 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.02]">
      {/* Image Wrapper */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 bg-white/5 flex items-center justify-center">
        <Image 
          src={primaryImage} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-4 py-2 bg-black/80 text-white/90 text-xs font-bold tracking-widest uppercase rounded-full border border-white/10 shadow-xl">
              Stokta Yok
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-gold)] font-semibold mb-2">
          {brandName}
        </div>
        
        <Link href={`/product/${product.id}`} className="block mb-4">
          <h3 className="text-xl font-playfair leading-tight text-white/90 group-hover:text-white transition-colors">
            {product.name}
            {product.model && <span className="block text-sm font-sans text-white/40 mt-1">{product.model}</span>}
          </h3>
        </Link>

        {/* Footer / Actions */}
        <div className="mt-auto flex items-center gap-2">
          <Link 
            href={`/product/${product.id}`}
            className="flex-1 py-2.5 text-center text-xs font-semibold tracking-wider uppercase text-white/80 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
          >
            İncele
          </Link>
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 text-center text-xs font-bold tracking-wider uppercase text-black bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] shadow-[0_0_15px_rgba(212,175,55,0.2)] rounded-xl transition-all hover:scale-[1.02]"
          >
            Bilgi Al
          </a>
        </div>
      </div>
    </div>
  );
}
