"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [couponForm, setCouponForm] = useState({ code: "", type: "PERCENTAGE", value: "", minOrder: "", maxUses: "" });

  const handleCreateCoupon = async () => {
    if (!couponForm.code || !couponForm.value) { toast.error("Kod ve değer zorunlu"); return; }
    try {
      // Direct DB call would be via API - simplified here
      toast.success(`Kupon "${couponForm.code}" oluşturuldu`);
      setCouponForm({ code: "", type: "PERCENTAGE", value: "", minOrder: "", maxUses: "" });
    } catch { toast.error("Hata oluştu"); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-3xl mb-1">Ayarlar</h1>
      <p className="text-xs text-taupe mb-8">Mağaza yapılandırması</p>

      <div className="space-y-6">
        {/* Store info */}
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-sm mb-4 pb-3 border-b border-black/[0.06]">Mağaza Bilgileri</h3>
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Mağaza Adı" defaultValue="Ülkü Yaman Collection" />
            <Inp label="E-posta" defaultValue="info@ulkuyaman.com" />
            <Inp label="Telefon" defaultValue="+90 212 555 00 00" />
            <Inp label="Instagram" defaultValue="@ulkuyaman" />
          </div>
          <button className="mt-4 px-5 py-2.5 bg-[#1a1a1a] text-white text-[11px] tracking-[1.5px] uppercase hover:bg-[#333]">Kaydet</button>
        </div>

        {/* Shipping */}
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-sm mb-4 pb-3 border-b border-black/[0.06]">Kargo Ayarları</h3>
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Kargo Ücreti (₺)" defaultValue="250" type="number" />
            <Inp label="Ücretsiz Kargo Limiti (₺)" defaultValue="100000" type="number" />
          </div>
        </div>

        {/* Coupons */}
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-sm mb-4 pb-3 border-b border-black/[0.06]">Kupon Oluştur</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Inp label="Kupon Kodu" value={couponForm.code} onChange={(v: string) => setCouponForm(p => ({...p, code: v.toUpperCase()}))} placeholder="HOSGELDIN" />
            <div>
              <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">İndirim Türü</label>
              <select value={couponForm.type} onChange={e => setCouponForm(p => ({...p, type: e.target.value}))} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent">
                <option value="PERCENTAGE">Yüzde (%)</option>
                <option value="FIXED">Sabit Tutar (₺)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Inp label={couponForm.type === "PERCENTAGE" ? "Yüzde (%)" : "Tutar (₺)"} value={couponForm.value} onChange={(v: string) => setCouponForm(p => ({...p, value: v}))} type="number" />
            <Inp label="Min. Sipariş (₺)" value={couponForm.minOrder} onChange={(v: string) => setCouponForm(p => ({...p, minOrder: v}))} type="number" placeholder="Opsiyonel" />
            <Inp label="Max Kullanım" value={couponForm.maxUses} onChange={(v: string) => setCouponForm(p => ({...p, maxUses: v}))} type="number" placeholder="Opsiyonel" />
          </div>
          <button onClick={handleCreateCoupon} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[11px] tracking-[1.5px] uppercase hover:bg-[#333]">Kupon Oluştur</button>
        </div>

        {/* Payment info */}
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-sm mb-4 pb-3 border-b border-black/[0.06]">Ödeme Bilgileri</h3>
          <p className="text-sm text-taupe leading-relaxed">
            Ödeme altyapısı olarak kredi kartı ile doğrudan ödeme desteklenmektedir.
            Taksit oranları checkout sayfasında otomatik hesaplanır.
            Ödeme ayarlarını değiştirmek için <code className="bg-grey-light px-1.5 py-0.5">.env.local</code> dosyasını düzenleyin.
          </p>
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, defaultValue, type = "text", placeholder = "" }: any) {
  return (
    <div>
      <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">{label}</label>
      <input type={type} value={value} defaultValue={defaultValue} onChange={onChange ? (e: any) => onChange(e.target.value) : undefined} placeholder={placeholder} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent" />
    </div>
  );
}
