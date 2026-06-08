// ============================================
// TREND OPTİK — Server-Side Firestore SDK
// ============================================
// Bu dosya SADECE server-side componentlerde (page.tsx, layout.tsx, route.ts vb.) 
// Firestore verilerini çekmek için kullanılmalıdır. 
// Veriler REST API üzerinden public olarak okunur. Admin SDK veya auth gerektirmez.

export interface Product {
  id: string;
  name: string;
  price: string | number;
  img: string;
  category: string;
  isFeatured?: boolean;
  description?: string;
  desc?: string;
  clicks?: number;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  brand?: string;
}

export async function getProductServer(id: string): Promise<Product | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/${id}`;

  try {
    const res = await fetch(firebaseUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields) return null;

    const fields = data.fields;
    return {
      id: data.name.split("/").pop() || id,
      name: fields.name?.stringValue || "",
      price: fields.price?.stringValue || fields.price?.integerValue || fields.price?.doubleValue || 0,
      img: fields.img?.stringValue || "",
      category: fields.category?.stringValue || "",
      isFeatured: fields.isFeatured?.booleanValue || false,
      description: fields.description?.stringValue || "",
      desc: fields.desc?.stringValue || "",
      clicks: fields.clicks?.integerValue || 0,
      seoTitle: fields.seoTitle?.stringValue || "",
      seoDescription: fields.seoDescription?.stringValue || "",
      slug: fields.slug?.stringValue || "",
      brand: fields.brand?.stringValue || "",
    };
  } catch (error) {
    console.error("Server-side product fetch error:", error);
    return null;
  }
}

export async function getAllProductsServer(): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=1000`;

  try {
    const res = await fetch(firebaseUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    
    return (data.documents || []).map((doc: any) => {
      const fields = doc.fields;
      return {
        id: doc.name.split("/").pop() || "",
        name: fields.name?.stringValue || "",
        price: fields.price?.stringValue || fields.price?.integerValue || fields.price?.doubleValue || 0,
        img: fields.img?.stringValue || "",
        category: fields.category?.stringValue || "",
        isFeatured: fields.isFeatured?.booleanValue || false,
        description: fields.description?.stringValue || "",
        desc: fields.desc?.stringValue || "",
        clicks: fields.clicks?.integerValue || 0,
        seoTitle: fields.seoTitle?.stringValue || "",
        seoDescription: fields.seoDescription?.stringValue || "",
        slug: fields.slug?.stringValue || "",
        brand: fields.brand?.stringValue || "",
      };
    });
  } catch (error) {
    console.error("Server-side all products fetch error:", error);
    return [];
  }
}

export async function getRelatedProductsServer(category: string, excludeId: string, limit: number = 4): Promise<Product[]> {
  const allProducts = await getAllProductsServer();
  return allProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}
