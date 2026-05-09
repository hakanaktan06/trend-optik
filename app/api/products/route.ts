// ============================================
// TREND OPTİK — Products API Route
// ============================================
// Server-side Firebase sorgusu — API key'ler client'a sızmaz.
// GET /api/products?kategori=gunes&marka=rayban
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const marka = searchParams.get("marka");
    const limitCount = parseInt(searchParams.get("limit") || "50");

    let q = query(collection(db, "urunler"), orderBy("createdAt", "desc"));

    // Filtreleme
    const constraints = [];
    if (kategori) {
      constraints.push(where("kategori", "==", kategori));
    }
    if (marka) {
      constraints.push(where("marka", "==", marka));
    }

    if (constraints.length > 0) {
      q = query(
        collection(db, "urunler"),
        ...constraints,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    } else {
      q = query(
        collection(db, "urunler"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
