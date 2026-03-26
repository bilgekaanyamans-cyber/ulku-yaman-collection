"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) fetch("/api/wishlist").then(r => r.json()).then(setItems).finally(() => setLoading(false));
    else setLoading(false);
  }, [session]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <Link href="/hesabim" className="text-xs text-taupe hover:text-[#1a1a1a] tracking-wide">&larr; Hesabım</Link>
      <h1 className="font-serif text-4xl mt-4 mb-10">Favorilerim</h1>
      {loading ? <p className="text-taupe text-center py-12">Yükleniyor...</p> :
       items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-taupe mb-4">Favori listeniz boş</p>
          <Link href="/sayfa" className="text-sm underline">Ürünlere göz at</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((item: any, i: number) => (
            <ProductCard key={item.id} product={item.product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
