// ============================================
// TREND OPTİK — Single Product API Route
// ============================================
// GET /api/products/:id
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, "urunler", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Ürün bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json(
      { error: "Ürün detayları yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
