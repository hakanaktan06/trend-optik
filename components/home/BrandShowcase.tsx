import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/firestore-server";

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section id="markalar" className="py-20 md:py-32 bg-[var(--background-secondary)] relative overflow-hidden">
      <div className="container-premium relative z-10">
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-4">
            Markalarımız
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Markalara Göre <span className="text-gradient-gold">Keşfet</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {brands.map((brand) => (
            <Link 
              key={brand.id}
              href={`/marka/${brand.slug}`}
              className="group flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl glass hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-white/10 hover:-translate-y-1"
            >
              {brand.logoUrl ? (
                <div className="relative w-full aspect-[3/1] mb-6">
                  <Image 
                    src={brand.logoUrl} 
                    alt={brand.name} 
                    fill 
                    className="object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-500" 
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ) : (
                <div className="text-xl md:text-2xl font-bold text-white/50 group-hover:text-white transition-colors duration-500 tracking-tight text-center mb-2">
                  {brand.name}
                </div>
              )}
              <div className="mt-auto text-[10px] uppercase tracking-widest text-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-1">
                Koleksiyonu Gör <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
