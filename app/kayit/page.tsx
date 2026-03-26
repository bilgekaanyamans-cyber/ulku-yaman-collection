"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Lütfen tüm alanları doldurun."); return; }
    if (password.length < 8) { setError("Şifre en az 8 karakter olmalı."); return; }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      // Kayıt başarılı → otomatik giriş
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Kayıt sırasında bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-light px-4">
      <div className="bg-white w-[440px] max-w-full p-12 shadow-[0_4px_40px_rgba(0,0,0,0.06)] animate-fade-in">
        <h1 className="font-serif text-2xl font-medium tracking-luxury uppercase text-center mb-1">
          Ülkü Yaman
        </h1>
        <p className="text-[10px] tracking-wide6 text-center text-taupe mb-9 uppercase">Collection</p>

        <h2 className="font-serif text-2xl text-center mb-2">Kayıt Ol</h2>
        <p className="text-sm text-taupe text-center mb-8">Alışverişe başlamak için hesap oluşturun</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#c1121f] px-4 py-3 text-xs text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Ad Soyad</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız"
              className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors" />
          </div>
          <div className="mb-4">
            <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com"
              className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors" />
          </div>
          <div className="mb-6">
            <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="En az 8 karakter"
              className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333] transition-colors disabled:bg-[#ccc]">
            {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe mt-6">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-[#1a1a1a] underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
