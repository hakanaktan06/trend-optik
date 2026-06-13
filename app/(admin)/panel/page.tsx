"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import DashboardHome from "@/components/admin/DashboardHome";
import Sidebar from "@/components/admin/Sidebar";
import ProductManager from "@/components/admin/ProductManager";
import Radar from "@/components/admin/Radar";
import OrderManager from "@/components/admin/OrderManager";
import VIPCerts from "@/components/admin/VIPCerts";
import LensRadar from "@/components/admin/LensRadar";
import TelegramSettings from "@/components/admin/TelegramSettings";
import BrandManager from "@/components/admin/BrandManager";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home");
  const firebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  const handleLogout = async () => {
    await signOut(auth);
    // Remove Edge-compatible session cookie
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Refresh to trigger Layout check
    window.location.reload();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161616",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#ea580c",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Firebase config warning */}
      {!firebaseConfigured && (
        <div className="fixed top-14 lg:top-0 left-0 lg:left-64 right-0 z-40 bg-red-500/10 border-b border-red-500/30 px-4 py-2 flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Firebase bağlantısı yok — Vercel&apos;de <code className="bg-red-500/20 px-1 rounded text-xs">NEXT_PUBLIC_FIREBASE_*</code> environment variable&apos;larını ekleyin.</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-64 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-10 lg:pt-16 max-w-7xl overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home" && <DashboardHome setActiveTab={setActiveTab} />}
            {activeTab === "brands" && <BrandManager />}
            {activeTab === "products" && <ProductManager />}
            {activeTab === "radar" && <Radar />}
            {activeTab === "orders" && <OrderManager />}
            {activeTab === "certs" && <VIPCerts />}
            {activeTab === "lenses" && <LensRadar />}
            {activeTab === "telegram" && <TelegramSettings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
