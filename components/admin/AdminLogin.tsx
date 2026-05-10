"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set Edge-compatible session cookie
      document.cookie = "admin_session=active; path=/; max-age=86400; SameSite=Strict";
      // Refresh the page to trigger the Server Component Layout check
      window.location.reload();
    } catch (err) {
      setError("Hatalı e-posta veya şifre girdiniz.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-gold)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Trend Optik Mersin</h2>
          <p className="text-white/40 tracking-[0.2em] uppercase text-xs">Yönetim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="glass p-8 rounded-3xl border border-white/5 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[var(--accent-gold)]" />
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="E-posta Adresi" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Şifre" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-light"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-4 mt-4 bg-gradient-to-r from-[var(--accent-gold-light)] to-[var(--accent-gold)] text-black font-medium rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Giriş Yap"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
