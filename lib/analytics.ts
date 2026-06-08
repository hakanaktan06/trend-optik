declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export const trackWhatsAppLead = (productName?: string) => {
  // GA4 event
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "generate_lead", {
      currency: "TRY",
      value: 1,
      item_name: productName || "General Inquiry",
    });
  }

  // Meta Pixel event (dormant until initialized)
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: productName || "General Inquiry",
    });
  }
};
