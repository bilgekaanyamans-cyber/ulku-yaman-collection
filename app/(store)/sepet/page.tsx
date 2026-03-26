"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { getCart, updateCartItem, removeCartItem } from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const fetchCart = async () => {
    if (!session) { setLoading(false); return; }
    try {
      const data = await getCart();
      setCart(data);
    } catch { toast.error("Sepet yüklenemedi"); }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, [session]);

  const handleQty = async (id: string, qty: number) => {
    try {
      if (qty < 1) { await removeCartItem(id); toast.success("Ürün kaldırıldı"); }
      else { await updateCartItem(id, qty); }
      fetchCart();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleRemove = async (id: string) => {
    try { await removeCartItem(id); toast.success("Ürün kaldırıldı"); fetchCart(); }
    catch (err: any) { toast.error(err.message); }
  };

  if (!session) return (
    <div className="max-w-[1000px] mx-auto px-5 py-20 text-center">
      <h1 className="font-serif text-4xl mb-4">Sepetiniz</h1>
      <p className="text-taupe mb-6">Sepetinizi görmek için giriş yapın</p>
      <Link href="/giris" className="inline-block px-12 py-4 bg-[#1a1a1a] text-white text-xs tracking-luxury uppercase hover:bg-[#333]">Giriş Yap</Link>
    </div>
  );

  if (loading) return (
    <div className="max-w-[1000px] mx-auto px-5 py-20 text-center">
      <div className="animate-pulse text-taupe">Yükleniyor...</div>
    </div>
  );

  const items = cart?.items || [];
  const total = cart?.total || 0;
  const shipping = total >= 100000 ? 0 : 250;

  return (
    <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <nav className="text-[11px] text-taupe tracking-wide flex gap-2 mb-8">
        <Link href="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link><span>/</span><span>Sepet</span>
      </nav>

      <h1 className="font-serif text-4xl text-center mb-12">Sepetiniz</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-taupe mb-6">Sepetiniz boş</p>
          <Link href="/sayfa" className="inline-block px-12 py-4 border border-[#1a1a1a] text-xs tracking-luxury uppercase hover:bg-[#1a1a1a] hover:text-white transition-all">
            Alışverişe Devam Et
          </Link>
        </div>
      ) : (
        <>
          {items.map((item: any) => (
            <div key={item.id} className="grid grid-cols-[100px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-5 items-center py-6 border-b border-black/[0.08]">
              <Link href={`/urun/${item.product.slug}`} className="aspect-[3/4] overflow-hidden bg-grey-light relative">
                <Image src={item.product.images[0]?.url || ""} alt={item.product.name} fill className="object-cover" sizes="120px" />
              </Link>
              <div>
                <p className="text-[10px] font-medium tracking-wide2 uppercase text-taupe mb-1">Ülkü Yaman Collection</p>
                <Link href={`/urun/${item.product.slug}`} className="font-serif text-lg block mb-1">{item.product.name}</Link>
                <p className="text-xs text-taupe mb-3">Beden: {item.variant.size} &nbsp;|&nbsp; Renk: {item.variant.colorName}</p>
                <div className="inline-flex items-center border border-black/15">
                  <button onClick={() => handleQty(item.id, item.quantity - 1)} className="p-2 hover:bg-grey-light"><Minus size={14} /></button>
                  <span className="px-3 text-sm min-w-[36px] text-center">{item.quantity}</span>
                  <button onClick={() => handleQty(item.id, item.quantity + 1)} className="p-2 hover:bg-grey-light"><Plus size={14} /></button>
                </div>
                <button onClick={() => handleRemove(item.id)} className="block text-[11px] text-taupe underline mt-2 hover:text-[#c1121f]">Kaldır</button>
              </div>
              <p className="text-base text-right">₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}</p>
            </div>
          ))}

          {/* Coupon */}
          <div className="flex gap-3 mt-8 max-w-md">
            <div className="flex-1 flex items-center border border-black/15 px-3">
              <Tag size={14} className="text-taupe mr-2" />
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Kupon kodu" className="flex-1 py-3 text-sm outline-none bg-transparent" />
            </div>
            <button className="px-6 py-3 border border-[#1a1a1a] text-xs tracking-wide uppercase hover:bg-[#1a1a1a] hover:text-white transition-all">Uygula</button>
          </div>

          {/* Summary */}
          <div className="mt-10 border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div>
              <p className="text-[11px] tracking-wide2 uppercase text-taupe mb-1">Ara toplam</p>
              <p className="font-serif text-3xl">₺{total.toLocaleString("tr-TR")}</p>
              <p className="text-xs text-taupe mt-1">
                Kargo: {shipping === 0 ? <span className="text-[#2d6a4f]">Ücretsiz</span> : `₺${shipping}`}
              </p>
            </div>
            <Link href="/odeme" className="w-full sm:w-auto px-16 py-[18px] bg-[#1a1a1a] text-white text-xs tracking-luxury uppercase text-center hover:bg-[#333] transition-colors">
              Ödemeye Geç
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
