import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (typeof phone !== "string" || phone.trim().length < 7 || phone.length > 20) {
      return NextResponse.json({ error: "Geçersiz telefon numarası." }, { status: 400 });
    }
    const snap = await adminDb.collection("orders").where("phone", "==", phone.trim()).limit(5).get();
    const results = snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, customerName: data.customerName ?? "", product: data.product ?? "", status: data.status ?? "" };
    });
    return NextResponse.json({ results });
  } catch (e) {
    console.error("Order tracking error", e);
    return NextResponse.json({ error: "Sorgulama sırasında bir hata oluştu." }, { status: 500 });
  }
}
