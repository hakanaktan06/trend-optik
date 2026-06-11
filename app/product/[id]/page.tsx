import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductServer, getRelatedProductsServer, getAllProductsServer, getAllBrandsServer } from "@/lib/firestore-server";
import ProductClientUI from "@/components/product/ProductClientUI";

// ISR: Cache refresh every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProductsServer();
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await params;
  const product = await getProductServer(p.id);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Trend Optik Mersin",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  const brands = await getAllBrandsServer();
  const brandName = brands.find(b => b.id === product.brandId || b.slug === product.brandId || b.name === product.brandId)?.name || product.brandId;

  const title = `${brandName} ${product.model} ${product.name} | Trend Optik Mersin`;
  const description = `${brandName} ${product.model} modelini Trend Optik Mersin'de keşfedin. Bilgi almak için WhatsApp'tan hemen ulaşın.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://trendoptikmersin.com/product/${p.id}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.images?.[0] || "/placeholder.png",
          width: 800,
          height: 800,
          alt: `${brandName} ${product.model} - Trend Optik Mersin`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.images?.[0] || "/placeholder.png"],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const product = await getProductServer(p.id);

  if (!product) {
    notFound();
  }

  const brands = await getAllBrandsServer();
  const brandName = brands.find(b => b.id === product.brandId || b.slug === product.brandId || b.name === product.brandId)?.name || product.brandId;

  const related = await getRelatedProductsServer(product.brandId, product.id);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0] || "/placeholder.png",
    ...(brandName && { "brand": { "@type": "Brand", "name": brandName } }),
    "description": product.description || "Trend Optik Mersin premium koleksiyonu.",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://trendoptikmersin.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": brandName,
        "item": `https://trendoptikmersin.com/marka/${product.brandId}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://trendoptikmersin.com/product/${p.id}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductClientUI product={product} related={related} brandName={brandName} />
    </main>
  );
}
