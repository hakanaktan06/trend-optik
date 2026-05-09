// ============================================
// TREND OPTİK — Utility Functions
// ============================================

/**
 * Classname birleştirici (cn) — conditional class oluşturma
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Fiyat formatlama — Türk Lirası
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * WhatsApp link oluşturucu
 */
export function createWhatsAppLink(phone: string, message?: string): string {
  const base = `https://wa.me/${phone.replace(/\s/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Slug oluşturucu — Türkçe karakter desteği
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
