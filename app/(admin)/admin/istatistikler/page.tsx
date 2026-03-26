import { db } from "@/lib/db";

export default async function StatsPage() {
  const [ordersByStatus, topProducts, revenueByMonth, totalCustomers, totalRevenue, avgOrder] = await Promise.all([
    db.order.groupBy({ by: ["status"], _count: true }),
    db.product.findMany({ orderBy: { sales: "desc" }, take: 8, select: { name: true, sales: true, views: true, price: true } }),
    db.$queryRaw`SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, SUM(total) as revenue, COUNT(*) as count FROM orders WHERE status IN ('PAID','PREPARING','SHIPPED','DELIVERED') GROUP BY TO_CHAR("createdAt", 'YYYY-MM') ORDER BY month DESC LIMIT 12` as any,
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.aggregate({ where: { status: { in: ["PAID","PREPARING","SHIPPED","DELIVERED"] } }, _sum: { total: true }, _avg: { total: true } }),
    db.order.count({ where: { status: { in: ["PAID","PREPARING","SHIPPED","DELIVERED"] } } }),
  ]);

  const rev = totalRevenue._sum.total || 0;
  const avg = Math.round(totalRevenue._avg.total || 0);

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor", PAID: "Onaylandı", PREPARING: "Hazırlanıyor", SHIPPED: "Kargoda",
    DELIVERED: "Teslim", CANCELLED: "İptal", REFUND_REQUESTED: "İade Talebi", REFUNDED: "İade",
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-3xl mb-1">İstatistikler</h1>
      <p className="text-xs text-taupe mb-8">Detaylı performans analizi</p>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { l: "Toplam Gelir", v: `₺${rev.toLocaleString("tr-TR")}` },
          { l: "Toplam Müşteri", v: totalCustomers },
          { l: "Sipariş Sayısı", v: avgOrder },
          { l: "Ortalama Sipariş", v: `₺${avg.toLocaleString("tr-TR")}` },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">{s.l}</p>
            <p className="font-serif text-3xl">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-black/[0.06]"><h3 className="font-medium text-sm">En Çok Satan Ürünler</h3></div>
          <table className="w-full text-sm">
            <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe">
              <th className="text-left p-4">Ürün</th><th className="text-left p-4">Satış</th><th className="text-left p-4">Görüntüleme</th><th className="text-left p-4">Dönüşüm</th>
            </tr></thead>
            <tbody>{topProducts.map((p: any) => (
              <tr key={p.name} className="border-t border-black/[0.04]">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.sales}</td>
                <td className="p-4">{p.views.toLocaleString("tr-TR")}</td>
                <td className="p-4">{p.views > 0 ? ((p.sales / p.views) * 100).toFixed(1) : 0}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* Order status distribution */}
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="p-5 border-b border-black/[0.06]"><h3 className="font-medium text-sm">Sipariş Durumu Dağılımı</h3></div>
          <div className="p-5 space-y-3">
            {ordersByStatus.map((s: any) => {
              const total = ordersByStatus.reduce((sum: number, x: any) => sum + x._count, 0);
              const pct = total > 0 ? Math.round((s._count / total) * 100) : 0;
              return (
                <div key={s.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{statusLabels[s.status] || s.status}</span>
                    <span className="text-taupe">{s._count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-grey-light rounded overflow-hidden">
                    <div className="h-full bg-[#1a1a1a] rounded" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly revenue */}
      {revenueByMonth.length > 0 && (
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-6">
          <div className="p-5 border-b border-black/[0.06]"><h3 className="font-medium text-sm">Aylık Gelir</h3></div>
          <div className="p-5 flex items-end gap-2 h-[240px]">
            {revenueByMonth.reverse().map((m: any) => {
              const max = Math.max(...revenueByMonth.map((x: any) => Number(x.revenue)));
              const h = max > 0 ? (Number(m.revenue) / max) * 180 : 4;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#1a1a1a] rounded-t hover:bg-sand transition-colors" style={{ height: `${h}px` }} title={`₺${Number(m.revenue).toLocaleString("tr-TR")}`} />
                  <span className="text-[10px] text-taupe">{m.month.substring(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
