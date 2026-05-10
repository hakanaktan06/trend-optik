import { Metadata } from "next";
import { cookies } from "next/headers";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Trend Optik Yönetim Paneli",
  description: "Trend Optik Yönetim Paneli",
  robots: "noindex, nofollow", // Admin paneli Google'da çıkmasın
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "active";

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-[var(--accent-gold)] selection:text-black">
      {isAdmin ? children : <AdminLogin />}
    </div>
  );
}
