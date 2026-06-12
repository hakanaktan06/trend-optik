// ============================================
// TREND OPTİK — Server-Side Firestore SDK
// ============================================
// Bu dosya SADECE server-side componentlerde (page.tsx, layout.tsx, route.ts vb.) 
// Firestore verilerini çekmek için kullanılmalıdır. 
// Veriler REST API üzerinden public olarak okunur. Admin SDK veya auth gerektirmez.

export interface Brand {
  id: string;
  name: string;
  slug: string;
  order: number;
  logoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  model: string;
  images: string[];
  description?: string;
  stock: number;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  source: 'manual';
  type?: 'kadin' | 'erkek' | 'cocuk' | 'gunes' | 'optik' | 'unisex' | null;
  createdAt?: any;
  updatedAt?: any;
  // Legacy fields for migration
  img?: string;
  category?: string;
  brand?: string;
}

export async function getProductServer(id: string): Promise<Product | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/${id}`;

  try {
    const res = await fetch(firebaseUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields) return null;

    const fields = data.fields;
    
    // Parse images array or fallback to legacy img
    let images: string[] = [];
    if (fields.images && fields.images.arrayValue && fields.images.arrayValue.values) {
      images = fields.images.arrayValue.values.map((v: any) => v.stringValue || "");
    } else if (fields.img?.stringValue) {
      images = [fields.img.stringValue];
    }

    return {
      id: data.name.split("/").pop() || id,
      name: fields.name?.stringValue || "",
      brandId: fields.brandId?.stringValue || fields.brand?.stringValue || "",
      model: fields.model?.stringValue || "",
      images,
      description: fields.description?.stringValue || fields.desc?.stringValue || "",
      stock: fields.stock?.integerValue ? parseInt(fields.stock.integerValue, 10) : 0,
      isFeatured: fields.isFeatured?.booleanValue || false,
      status: fields.status?.stringValue === 'draft' ? 'draft' : 'published',
      source: 'manual',
      type: fields.type?.stringValue || null,
      // legacy
      category: fields.category?.stringValue || "",
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
    const res = await fetch(firebaseUrl, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json();
    
    return (data.documents || []).map((doc: any) => {
      const fields = doc.fields;
      
      let images: string[] = [];
      if (fields.images && fields.images.arrayValue && fields.images.arrayValue.values) {
        images = fields.images.arrayValue.values.map((v: any) => v.stringValue || "");
      } else if (fields.img?.stringValue) {
        images = [fields.img.stringValue];
      }

      return {
        id: doc.name.split("/").pop() || "",
        name: fields.name?.stringValue || "",
        brandId: fields.brandId?.stringValue || fields.brand?.stringValue || "",
        model: fields.model?.stringValue || "",
        images,
        description: fields.description?.stringValue || fields.desc?.stringValue || "",
        stock: fields.stock?.integerValue ? parseInt(fields.stock.integerValue, 10) : 0,
        isFeatured: fields.isFeatured?.booleanValue || false,
        status: fields.status?.stringValue === 'draft' ? 'draft' : 'published',
        source: 'manual',
        type: fields.type?.stringValue || null,
        category: fields.category?.stringValue || "",
      };
    });
  } catch (error) {
    console.error("Server-side all products fetch error:", error);
    return [];
  }
}

export async function getAllBrandsServer(): Promise<Brand[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/brands?pageSize=1000`;

  try {
    const res = await fetch(firebaseUrl, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json();
    
    const brands = (data.documents || []).map((doc: any) => {
      const fields = doc.fields;
      return {
        id: doc.name.split("/").pop() || "",
        name: fields.name?.stringValue || "",
        slug: fields.slug?.stringValue || "",
        order: fields.order?.integerValue ? parseInt(fields.order.integerValue, 10) : 999,
        logoUrl: fields.logoUrl?.stringValue || "",
      };
    });
    
    return brands.sort((a: Brand, b: Brand) => a.order - b.order);
  } catch (error) {
    console.error("Server-side brands fetch error:", error);
    return [];
  }
}

export async function getProductsByBrandServer(brandSlug: string): Promise<Product[]> {
  const brands = await getAllBrandsServer();
  const brand = brands.find(b => b.slug === brandSlug);
  
  const allProducts = await getAllProductsServer();
  
  if (!brand) {
    // Fallback: if no brand doc matches, maybe they are using legacy category field with the slug
    return allProducts.filter(p => p.status === 'published' && p.category === brandSlug);
  }

  return allProducts.filter(p => p.status === 'published' && (p.brandId === brand.id || p.brandId === brand.slug || p.brandId === brand.name));
}

export async function getRelatedProductsServer(brandId: string, excludeId: string, limit: number = 4): Promise<Product[]> {
  const allProducts = await getAllProductsServer();
  return allProducts
    .filter((p) => p.status === 'published' && p.brandId === brandId && p.id !== excludeId)
    .slice(0, limit);
}
