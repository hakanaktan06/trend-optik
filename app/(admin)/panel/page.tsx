"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import DashboardHome from "@/components/admin/DashboardHome";
import Sidebar from "@/components/admin/Sidebar";
import ProductManager from "@/components/admin/ProductManager";
import Radar from "@/components/admin/Radar";
import OrderManager from "@/components/admin/OrderManager";
import VIPCerts from "@/components/admin/VIPCerts";
import LensRadar from "@/components/admin/LensRadar";
import TelegramSettings from "@/components/admin/TelegramSettings";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("home");

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

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 pt-20 lg:p-10 lg:pt-16 max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home" && <DashboardHome setActiveTab={setActiveTab} />}
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
