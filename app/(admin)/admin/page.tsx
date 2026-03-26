import { db } from "@/lib/db";
import { TrendingUp, TrendingDown, Package, Eye, ShoppingCart, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const [totalRevenue, totalOrders, totalProducts, recentOrders, topProducts] = await Promise.all([
    db.order.aggregate({ where: { status: { in: ["PAID","PREPARING","SHIPPED","DELIVERED"] } }, _sum: { total: true } }),
    db.order.count(),
    db.product.count({ where: { active: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { name: true } } } }),
    db.product.findMany({ orderBy: { sales: "desc" }, take: 5, select: { name: true, sales: true, price: true, views: true } }),
  ]);

  const stats = [
    { label: "Toplam Gelir", value: `₺${(totalRevenue._sum.total || 0).toLocaleString("tr-TR")}`, icon: <DollarSign size={20} /> },
    { label: "Toplam Sipariş", value: totalOrders, icon: <ShoppingCart size={20} /> },
    { label: "Aktif Ürün", value: totalProducts, icon: <Package size={20} /> },
  ];

  const statusMap: Record<string,{l:string,c:string}> = {
    PENDING:{l:"Bekliyor",c:"bg-amber-50 text-amber-800"},PAID:{l:"Onaylandı",c:"bg-blue-50 text-blue-800"},
    PREPARING:{l:"Hazırlanıyor",c:"bg-yellow-50 text-yellow-800"},SHIPPED:{l:"Kargoda",c:"bg-indigo-50 text-indigo-800"},
    DELIVERED:{l:"Teslim",c:"bg-green-50 text-green-800"},CANCELLED:{l:"İptal",c:"bg-red-50 text-red-800"},
    REFUND_REQUESTED:{l:"İade Talebi",c:"bg-orange-50 text-orange-800"},REFUNDED:{l:"İade",c:"bg-gray-50 text-gray-800"},
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-3xl mb-1">Dashboard</h1>
      <p className="text-xs text-taupe mb-8">Günlük özet</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] tracking-[1.5px] uppercase text-taupe">{s.label}</span>
              <span className="text-taupe">{s.icon}</span>
            </div>
            <p className="font-serif text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-black/[0.06]"><h3 className="font-medium text-sm">Son Siparişler</h3></div>
          <table className="w-full text-sm">
            <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe"><th className="text-left p-4">Sipariş</th><th className="text-left p-4">Müşteri</th><th className="text-left p-4">Tutar</th><th className="text-left p-4">Durum</th></tr></thead>
            <tbody>{recentOrders.map((o: any) => { const st = statusMap[o.status] || {l:o.status,c:"bg-gray-50 text-gray-800"}; return (
              <tr key={o.id} className="border-t border-black/[0.04] hover:bg-black/[0.01]">
                <td className="p-4 font-medium">{o.orderNumber}</td>
                <td className="p-4">{o.user?.name || "—"}</td>
                <td className="p-4">₺{o.total.toLocaleString("tr-TR")}</td>
                <td className="p-4"><span className={`px-2.5 py-1 text-[10px] tracking-wide uppercase font-medium ${st.c}`}>{st.l}</span></td>
              </tr>); })}</tbody>
          </table>
        </div>

        {/* Top products */}
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-black/[0.06]"><h3 className="font-medium text-sm">En Çok Satanlar</h3></div>
          <table className="w-full text-sm">
            <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe"><th className="text-left p-4">Ürün</th><th className="text-left p-4">Satış</th><th className="text-left p-4">Gelir</th></tr></thead>
            <tbody>{topProducts.map((p: any) => (
              <tr key={p.name} className="border-t border-black/[0.04] hover:bg-black/[0.01]">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.sales}</td>
                <td className="p-4">₺{(p.sales * p.price).toLocaleString("tr-TR")}</td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
