import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, style, type } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Ad ve Telefon numarası zorunludur." },
        { status: 400 }
      );
    }

    // Admin SDK kullanarak Telegram ayarlarını al (bypasses rules)
    const docRef = adminDb.collection("settings").doc("telegram");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Telegram ayarları henüz yapılandırılmamış." },
        { status: 500 }
      );
    }

    const docData = docSnap.data();
    const token = docData?.token?.trim();
    const chatId = docData?.chatId?.trim();

    if (!token || !chatId) {
      return NextResponse.json(
        { error: "Telegram Token veya Chat ID eksik." },
        { status: 500 }
      );
    }

    // Kullanıcı girdilerindeki potansiyel HTML karakterlerini temizle (XSS/Telegram HTML parse hatasını önlemek için)
    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
    const safePhone = phone.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
    const safeStyle = (style || "Belirtilmedi").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
    const safeType = (type || "Belirtilmedi").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");

    // Telegram'a gönderilecek lüks formatlı mesaj (HTML formatında daha güvenli)
    const message = `
🌟 <b>YENİ VIP RANDEVU TALEBİ</b> 🌟

👤 <b>Müşteri:</b> ${safeName}
📱 <b>Telefon:</b> ${safePhone}

✨ <b>Seçilen Tarz:</b> ${safeStyle}
👓 <b>İhtiyaç:</b> ${safeType}

<i>Trend Optik Mersin - Dijital Concierge</i>
    `;

    // Telegram API'ye POST isteği at
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Hatası:", errorData);
      return NextResponse.json(
        { error: "Telegram'a mesaj gönderilemedi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "VIP talebiniz başarıyla iletildi." });

  } catch (error) {
    console.error("VIP Randevu Hatası:", error);
    return NextResponse.json(
      { error: "İşlem sırasında beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
