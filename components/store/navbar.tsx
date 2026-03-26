"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag, Search, User, Heart, Menu, X, LogOut } from "lucide-react";

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      <div className="bg-[#1a1a1a] text-white text-center py-2.5 text-[11px] tracking-[2px] font-light">
        TÜRKİYE&apos;YE ÜCRETSİZ KARGO &nbsp;•&nbsp; 100.000₺ ÜZERİ SİPARİŞLERDE
      </div>

      <nav className={`sticky top-0 z-50 bg-white transition-all duration-400 ${scrolled ? "shadow-[0_1px_20px_rgba(0,0,0,0.05)]" : "border-b border-black/[0.06]"}`}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[72px] grid grid-cols-3 items-center">
          
          {/* Sol: Linkler */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="/">Ana Sayfa</NavLink>
            <NavLink href="/sayfa">Sandaletler</NavLink>
            <NavLink href="/hakkimizda">Hakkımızda</NavLink>
            {isAdmin && <NavLink href="/admin">Yönetim</NavLink>}
          </div>
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>

          {/* Orta: Brand — tam ortada */}
          <Link href="/" className="flex flex-col items-center justify-center">
            <span className="font-serif text-[22px] font-medium tracking-[3px] uppercase leading-none">Ülkü Yaman</span>
            <span className="text-[9px] font-light tracking-[6px] text-[#8b7d6b] uppercase mt-1">Collection</span>
          </Link>

          {/* Sağ: İkonlar */}
          <div className="flex items-center justify-end gap-5">
            <Link href="/arama" className="hover:opacity-60 transition-opacity hidden sm:block"><Search size={18} /></Link>
            <Link href="/hesabim/favoriler" className="hover:opacity-60 transition-opacity hidden sm:block"><Heart size={18} /></Link>
            <div className="relative">
              <button onClick={() => setUserOpen(!userOpen)} className="hover:opacity-60 transition-opacity"><User size={18} /></button>
              {userOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 top-10 bg-white border border-black/10 shadow-lg min-w-[200px] z-50">
                    {session ? (
                      <>
                        <div className="px-4 py-3 border-b border-black/5"><p className="text-[10px] text-[#8b7d6b] uppercase tracking-wide">Hoş geldin</p><p className="text-sm font-medium truncate mt-0.5">{session.user?.name}</p></div>
                        <Link href="/hesabim" className="block px-4 py-2.5 text-sm hover:bg-[#f8f7f5]" onClick={() => setUserOpen(false)}>Hesabım</Link>
                        <Link href="/hesabim/siparisler" className="block px-4 py-2.5 text-sm hover:bg-[#f8f7f5]" onClick={() => setUserOpen(false)}>Siparişlerim</Link>
                        {isAdmin && <Link href="/admin" className="block px-4 py-2.5 text-sm hover:bg-[#f8f7f5] text-[#c4a882]" onClick={() => setUserOpen(false)}>Admin Panel</Link>}
                        <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f8f7f5] text-[#c1121f] flex items-center gap-2 border-t border-black/5" onClick={() => { signOut(); setUserOpen(false); }}><LogOut size={14} /> Çıkış Yap</button>
                      </>
                    ) : (
                      <>
                        <Link href="/giris" className="block px-4 py-3 text-sm hover:bg-[#f8f7f5]" onClick={() => setUserOpen(false)}>Giriş Yap</Link>
                        <Link href="/kayit" className="block px-4 py-3 text-sm hover:bg-[#f8f7f5] border-t border-black/5" onClick={() => setUserOpen(false)}>Kayıt Ol</Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <Link href="/sepet" className="hover:opacity-60 transition-opacity relative">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#1a1a1a] text-white text-[9px] font-medium rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-black/5 bg-white px-5 py-4">
            {[{h:"/",l:"Ana Sayfa"},{h:"/sayfa",l:"Sandaletler"},{h:"/arama",l:"Ara"}].map(x => (
              <Link key={x.h} href={x.h} className="block py-3 text-sm tracking-wide border-b border-black/5 last:border-0" onClick={() => setMenuOpen(false)}>{x.l}</Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-[11px] tracking-[1.5px] uppercase relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1a1a1a] after:transition-[width] after:duration-300 hover:after:w-full">{children}</Link>;
}
