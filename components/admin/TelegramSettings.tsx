"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, Loader2, Save, Info } from "lucide-react";

export default function TelegramSettings() {
  const [token, setToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "telegram");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setToken(docSnap.data().token || "");
          setChatId(docSnap.data().chatId || "");
        }
      } catch (error) {
        console.error("Error fetching telegram settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      await setDoc(doc(db, "settings", "telegram"), {
        token,
        chatId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setStatus({ type: "success", message: "Telegram ayarları başarıyla kaydedildi." });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      console.error("Error saving telegram settings:", error);
      setStatus({ type: "error", message: "Ayarlar kaydedilirken bir hata oluştu." });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!token || !chatId) {
      setStatus({ type: "error", message: "Test için Token ve Chat ID gerekli." });
      return;
    }
    
    setStatus({ type: "", message: "Test mesajı gönderiliyor..." });
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ *Trend Optik Mersin*\n\nTelegram Bot entegrasyonu başarıyla sağlandı!",
          parse_mode: "Markdown"
        })
      });
      
      if (response.ok) {
        setStatus({ type: "success", message: "Test mesajı başarıyla gönderildi!" });
      } else {
        const data = await response.json();
        setStatus({ type: "error", message: `Test başarısız: ${data.description}` });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Test mesajı gönderilirken bir hata oluştu." });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--accent-gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Send className="w-8 h-8 text-[var(--accent-gold)]" />
        <h2 className="text-xl md:text-3xl font-bold text-white">Telegram Ayarları</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
          
          <h3 className="text-xl font-medium text-white mb-6">VIP Randevu Bildirimleri</h3>
          
          <form onSubmit={handleSave} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-2">Bot Token</label>
              <input 
                type="text" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Örn: 123456789:ABCdefGHIjklMNOpqrs..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-mono text-sm"
              />
              <p className="text-white/30 text-xs mt-2 italic font-light">BotFather'dan aldığınız HTTP API token.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--accent-gold)] uppercase tracking-widest mb-2">Chat ID</label>
              <input 
                type="text" 
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Örn: 123456789 veya -100123456789" 
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-colors font-mono text-sm"
              />
              <p className="text-white/30 text-xs mt-2 italic font-light">Bildirimlerin gideceği kişi veya grubun ID numarası.</p>
            </div>

            {status.message && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {status.message}
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 py-4 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-black font-bold rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Ayarları Kaydet
              </button>
              
              <button 
                type="button" 
                onClick={handleTest}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex justify-center items-center gap-2"
              >
                Test Mesajı At
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="glass p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-[var(--accent-gold)]" />
            <h3 className="text-xl font-medium text-white">Nasıl Kurulur?</h3>
          </div>
          
          <ul className="space-y-6 text-white/60 font-light text-sm">
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[var(--accent-gold)] font-bold text-xs flex-shrink-0">1</span>
              <div>
                <strong className="text-white font-medium block mb-1">BotFather'dan Bot Oluşturun</strong>
                Telegram'da <span className="text-[var(--accent-gold)]">@BotFather</span> hesabını bulun, <code>/newbot</code> yazarak botunuzu oluşturun ve size verilen HTTP API Token'ı kopyalayıp sol taraftaki alana yapıştırın.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[var(--accent-gold)] font-bold text-xs flex-shrink-0">2</span>
              <div>
                <strong className="text-white font-medium block mb-1">Chat ID Öğrenin</strong>
                Telegram'da <span className="text-[var(--accent-gold)]">@userinfobot</span> hesabına gidip <code>/start</code> diyerek kendi Chat ID'nizi öğrenebilirsiniz. Gruba eklerseniz grubun ID'sini girmeniz gerekir (eksi - işaretiyle başlar).
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[var(--accent-gold)] font-bold text-xs flex-shrink-0">3</span>
              <div>
                <strong className="text-white font-medium block mb-1">Botu Başlatın</strong>
                Oluşturduğunuz botu Telegram'da bulup <code>/start</code> diyerek başlatmayı unutmayın. Aksi takdirde bot size mesaj gönderemez!
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
