import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trend Optik Yönetim Paneli",
  description: "Trend Optik Yönetim Paneli",
  robots: "noindex, nofollow", // Admin paneli Google'da çıkmasın
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-[var(--accent-gold)] selection:text-black">
      {children}
    </div>
  );
}
