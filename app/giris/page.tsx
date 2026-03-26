"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Lütfen tüm alanları doldurun."); return; }

    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-light px-4">
      <div className="bg-white w-[440px] max-w-full p-12 shadow-[0_4px_40px_rgba(0,0,0,0.06)] animate-fade-in">
        <h1 className="font-serif text-2xl font-medium tracking-luxury uppercase text-center mb-1">
          Ülkü Yaman
        </h1>
        <p className="text-[10px] tracking-wide6 text-center text-taupe mb-9 uppercase">Collection</p>

        <h2 className="font-serif text-2xl text-center mb-2">Giriş Yap</h2>
        <p className="text-sm text-taupe text-center mb-8">Devam etmek için giriş yapın</p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full py-4 border border-black/15 text-xs tracking-wide2 uppercase flex items-center justify-center gap-2.5 hover:bg-grey-light transition-colors mb-0"
        >
          <GoogleIcon /> Google ile Giriş Yap
        </button>

        <div className="flex items-center gap-4 my-6 text-[11px] text-[#999] tracking-wide">
          <span className="flex-1 h-px bg-black/10" />veya<span className="flex-1 h-px bg-black/10" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#c1121f] px-4 py-3 text-xs text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333] transition-colors disabled:bg-[#ccc]"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-sm text-taupe mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="text-[#1a1a1a] underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
