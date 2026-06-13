import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBrandsServer, getProductsByBrandServer } from "@/lib/firestore-server";
import PremiumProductCard from "@/components/product/PremiumProductCard";

export const revalidate = 60;

export async function generateStaticParams() {
  const brands = await getAllBrandsServer();
  return brands.map((b) => ({ slug: b.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const brands = await getAllBrandsServer();
  const brand = brands.find(b => b.slug === p.slug);
  
  if (!brand) return { title: "Marka Bulunamadı" };

  return {
    title: `${brand.name} Gözlük Modelleri`,
    description: `${brand.name} güneş gözlüğü ve çerçeve modelleri Trend Optik Mersin'de. Tüm ${brand.name} koleksiyonunu inceleyin.`
  };
}

export default async function BrandPage({ params }: Props) {
  const p = await params;
  const brands = await getAllBrandsServer();
  const brand = brands.find(b => b.slug === p.slug);

  if (!brand) return notFound();

  const products = await getProductsByBrandServer(p.slug);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#050505]">
      <div className="container-premium">
        
        {/* Brand Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-8">
          {brand.logoUrl && (
            <div className="w-32 h-32 relative bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">{brand.name}</h1>
            <p className="text-white/40 tracking-wider uppercase text-sm font-medium">Koleksiyonu</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <PremiumProductCard 
                key={product.id} 
                product={product} 
                brandName={brand.name} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-[2.5rem]">
            <p className="text-white/30 text-lg mb-2">Bu markaya ait henüz ürün eklenmemiş.</p>
            <p className="text-white/20 italic font-light tracking-widest text-xs uppercase">
              Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
