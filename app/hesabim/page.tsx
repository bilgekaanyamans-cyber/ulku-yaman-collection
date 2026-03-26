"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Package, MapPin, Heart, User, ChevronRight } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center text-taupe">Yükleniyor...</div>;
  if (!session) return null;

  const links = [
    { href: "/hesabim/siparisler", icon: <Package size={20} />, title: "Siparişlerim", desc: "Sipariş geçmişi ve takip" },
    { href: "/hesabim/adresler", icon: <MapPin size={20} />, title: "Adreslerim", desc: "Teslimat adresleri" },
    { href: "/hesabim/favoriler", icon: <Heart size={20} />, title: "Favorilerim", desc: "Beğendiğiniz ürünler" },
  ];

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <h1 className="font-serif text-4xl mb-2">Hesabım</h1>
      <p className="text-taupe mb-10">Hoş geldin, {session.user?.name}</p>

      <div className="grid gap-4">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="flex items-center gap-5 p-5 border border-black/[0.08] hover:border-black/20 transition-colors group">
            <div className="text-taupe">{l.icon}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{l.title}</p>
              <p className="text-xs text-taupe">{l.desc}</p>
            </div>
            <ChevronRight size={16} className="text-taupe group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 bg-grey-light">
        <h3 className="font-medium text-sm mb-4">Hesap Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-taupe block text-xs mb-1">Ad Soyad</span>{session.user?.name}</div>
          <div><span className="text-taupe block text-xs mb-1">E-posta</span>{session.user?.email}</div>
        </div>
      </div>
    </div>
  );
}
