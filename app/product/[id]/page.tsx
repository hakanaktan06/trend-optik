import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductServer, getRelatedProductsServer, getAllProductsServer } from "@/lib/firestore-server";
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
  const { id } = await params;
  const product = await getProductServer(id);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Trend Optik Mersin",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  const title = product.seoTitle || `${product.name} ${product.brand || ""} ${product.category || ""} | Mersin`;
  const description = product.seoDescription || `${product.name} modelini Trend Optik Mersin'de keşfedin. ${product.brand ? product.brand + " orijinal ürün. " : ""}Fiyat ve stok bilgisi için WhatsApp'tan hemen ulaşın.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://trendoptikmersin.com/product/${id}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.img,
          width: 800,
          height: 800,
          alt: `${product.name} - Trend Optik Mersin`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.img],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductServer(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProductsServer(product.category, product.id);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.img,
    ...(product.brand && { "brand": { "@type": "Brand", "name": product.brand } }),
    "category": product.category,
    "description": product.description || product.desc || "Trend Optik Mersin premium koleksiyonu.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "TRY",
      "price": String(product.price).replace(/[^0-9.,]/g, '') || "0",
      "availability": "https://schema.org/InStock",
      "url": `https://trendoptikmersin.com/product/${id}`,
      "seller": { "@type": "Organization", "name": "Trend Optik Mersin" }
    }
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
        "name": "Katalog",
        "item": "https://trendoptikmersin.com/katalog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://trendoptikmersin.com/product/${id}`
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
      <ProductClientUI product={product} related={related} />
    </main>
  );
}
