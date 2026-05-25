import CollectionDetailClient from "./CollectionDetailClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const titles: Record<string, string> = {
    "1": "Güneş Koleksiyonu",
    "2": "Retro Serisi",
    "3": "Minimalist Çizgiler",
    "4": "Moda İkonları",
    "5": "Altın Saat",
    "6": "Usta Elleri",
  };

  const title = titles[resolvedParams.id] || "Koleksiyon İncelemesi";

  return {
    title: `${title} - Trend Optik`,
    description: "Trend Optik premium koleksiyon serisini inceleyin.",
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CollectionDetailClient id={resolvedParams.id} />;
}
