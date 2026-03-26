"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ClipboardList, BarChart3, Settings, LogOut } from "lucide-react";

const links = [
  { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Panel" },
  { href: "/admin/urunler", icon: <Package size={20} />, label: "Ürünler" },
  { href: "/admin/siparisler", icon: <ClipboardList size={20} />, label: "Siparişler" },
  { href: "/admin/istatistikler", icon: <BarChart3 size={20} />, label: "İstatistikler" },
  { href: "/admin/ayarlar", icon: <Settings size={20} />, label: "Ayarlar" },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] max-md:w-[60px] bg-[#1a1a1a] text-white fixed top-0 left-0 bottom-0 z-50 flex flex-col">
      <div className="p-6 border-b border-white/[0.08] max-md:hidden">
        <h1 className="font-serif text-lg tracking-wide2 uppercase">Ülkü Yaman</h1>
        <p className="text-[9px] tracking-[4px] text-sand mt-1 font-light">Yönetim Paneli</p>
      </div>

      <nav className="flex-1 py-5">
        {links.map(l => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3.5 px-6 py-3.5 text-sm transition-all border-l-[3px] max-md:justify-center max-md:px-0 ${active ? "text-white bg-white/[0.06] border-l-sand" : "text-white/50 border-transparent hover:text-white hover:bg-white/[0.04]"}`}>
              {l.icon}<span className="max-md:hidden">{l.label}</span>
            </Link>
          );
        })}

        <div className="h-px bg-white/[0.06] mx-6 my-3" />

        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-white/50 hover:text-white transition-all w-full max-md:justify-center max-md:px-0">
          <LogOut size={20} /><span className="max-md:hidden">Çıkış</span>
        </button>
      </nav>

      <div className="p-5 border-t border-white/[0.08] max-md:hidden">
        <p className="text-xs text-white/50">{user?.name}</p>
        <p className="text-[11px] text-white/30">{user?.email}</p>
      </div>
    </aside>
  );
}
