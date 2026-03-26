"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("E-posta adresi girin"); return; }
    setLoading(true);
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch { toast.error("Bir hata oluştu"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-light px-4">
      <div className="bg-white w-[440px] max-w-full p-12 shadow-[0_4px_40px_rgba(0,0,0,0.06)] animate-fade-in">
        <h1 className="font-serif text-2xl font-medium tracking-luxury uppercase text-center mb-1">Ülkü Yaman</h1>
        <p className="text-[10px] tracking-wide6 text-center text-taupe mb-9 uppercase">Collection</p>

        {sent ? (
          <div className="text-center">
            <h2 className="font-serif text-2xl mb-3">E-posta Gönderildi</h2>
            <p className="text-sm text-taupe mb-6">
              Şifre sıfırlama linki <strong>{email}</strong> adresine gönderildi. Lütfen e-postanızı kontrol edin.
            </p>
            <Link href="/giris" className="text-sm underline">Giriş sayfasına dön</Link>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-center mb-2">Şifremi Unuttum</h2>
            <p className="text-sm text-taupe text-center mb-8">E-posta adresinize şifre sıfırlama linki gönderelim</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">E-posta</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a]" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333] disabled:bg-[#ccc]">
                {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
              </button>
            </form>
            <p className="text-center text-sm text-taupe mt-6">
              <Link href="/giris" className="underline">Giriş yap</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
