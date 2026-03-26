"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getOrders, updateOrderStatus } from "@/lib/api";

const statuses = [
  { value: "PENDING", label: "Bekliyor", color: "bg-amber-50 text-amber-800" },
  { value: "PAID", label: "Onaylandı", color: "bg-blue-50 text-blue-800" },
  { value: "PREPARING", label: "Hazırlanıyor", color: "bg-yellow-50 text-yellow-800" },
  { value: "SHIPPED", label: "Kargoda", color: "bg-indigo-50 text-indigo-800" },
  { value: "DELIVERED", label: "Teslim Edildi", color: "bg-green-50 text-green-800" },
  { value: "CANCELLED", label: "İptal", color: "bg-red-50 text-red-800" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getOrders().then(d => setOrders(d.orders)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Durum güncellendi");
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="text-taupe py-20 text-center">Yükleniyor...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-serif text-3xl">Siparişler</h1><p className="text-xs text-taupe mt-1">{orders.length} sipariş</p></div>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe border-b border-black/[0.06]">
            <th className="text-left p-4">Sipariş</th><th className="text-left p-4">Müşteri</th><th className="text-left p-4">Tarih</th><th className="text-left p-4">Tutar</th><th className="text-left p-4">Durum</th><th className="text-left p-4">İşlem</th>
          </tr></thead>
          <tbody>{orders.map((o: any) => {
            const st = statuses.find(s => s.value === o.status);
            return (
              <tr key={o.id} className="border-b border-black/[0.04] hover:bg-black/[0.01]">
                <td className="p-4 font-medium">{o.orderNumber}</td>
                <td className="p-4">{o.user?.name || "—"}<br /><span className="text-[11px] text-taupe">{o.user?.email}</span></td>
                <td className="p-4 text-taupe">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</td>
                <td className="p-4">₺{o.total.toLocaleString("tr-TR")}</td>
                <td className="p-4"><span className={`px-2.5 py-1 text-[10px] tracking-wide uppercase font-medium ${st?.color || "bg-gray-50"}`}>{st?.label || o.status}</span></td>
                <td className="p-4">
                  <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                    className="text-xs border border-black/15 px-2 py-1.5 bg-transparent">
                    {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
