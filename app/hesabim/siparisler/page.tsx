"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { getOrders } from "@/lib/api";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Ödeme Bekleniyor", color: "bg-amber-50 text-amber-800" },
  PAID: { label: "Onaylandı", color: "bg-blue-50 text-blue-800" },
  PREPARING: { label: "Hazırlanıyor", color: "bg-yellow-50 text-yellow-800" },
  SHIPPED: { label: "Kargoda", color: "bg-indigo-50 text-indigo-800" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-50 text-green-800" },
  CANCELLED: { label: "İptal Edildi", color: "bg-red-50 text-red-800" },
  REFUND_REQUESTED: { label: "İade Talebi", color: "bg-orange-50 text-orange-800" },
  REFUNDED: { label: "İade Edildi", color: "bg-gray-50 text-gray-800" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) getOrders().then(d => setOrders(d.orders)).finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="max-w-[900px] mx-auto px-5 py-20 text-center text-taupe">Yükleniyor...</div>;

  return (
    <div className="max-w-[900px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <Link href="/hesabim" className="text-xs text-taupe hover:text-[#1a1a1a] tracking-wide">&larr; Hesabım</Link>
      <h1 className="font-serif text-4xl mt-4 mb-10">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-taupe mb-4">Henüz siparişiniz yok</p>
          <Link href="/sayfa" className="text-sm underline">Alışverişe başla</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const st = statusMap[order.status] || { label: order.status, color: "bg-gray-50 text-gray-800" };
            return (
              <div key={order.id} className="border border-black/[0.08] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-taupe">{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] tracking-wide uppercase font-medium ${st.color}`}>{st.label}</span>
                    <span className="font-medium">₺{order.total.toLocaleString("tr-TR")}</span>
                  </div>
                </div>

                {order.trackingNumber && (
                  <p className="text-xs text-taupe mb-3">Kargo: {order.shippingCompany} — {order.trackingNumber}</p>
                )}

                <div className="flex gap-3 overflow-x-auto py-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex-shrink-0 w-16 h-20 relative bg-grey-light overflow-hidden">
                      <Image src={item.product.images[0]?.url || ""} alt={item.product.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
