"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { getCart, createOrder } from "@/lib/api";

const CITIES = ["İstanbul","Ankara","İzmir","Bursa","Antalya","Adana","Konya","Gaziantep","Mersin","Diyarbakır","Kayseri","Eskişehir","Trabzon","Samsun","Denizli","Muğla","Balıkesir","Hatay","Manisa","Sakarya"];
const INSTALLMENTS = [{m:1,l:"Tek Çekim",r:0},{m:3,l:"3 Taksit",r:0},{m:6,l:"6 Taksit",r:2.49},{m:9,l:"9 Taksit",r:4.99},{m:12,l:"12 Taksit",r:7.49}];

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState("card");
  const [inst, setInst] = useState(1);
  const [addr, setAddr] = useState({ firstName:"",lastName:"",email:"",phone:"",address:"",city:"",district:"",zip:"" });
  const [card, setCard] = useState({ holderName:"",number:"",expireMonth:"",expireYear:"",cvc:"" });
  const [coupon, setCoupon] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) { router.push("/giris"); return; }
    getCart().then(setCart).catch(() => toast.error("Sepet yüklenemedi")).finally(() => setLoading(false));
  }, [session]);

  if (loading) return <div className="max-w-[1100px] mx-auto px-5 py-20 text-center text-taupe">Yükleniyor...</div>;
  if (!cart?.items?.length) return <div className="max-w-[1100px] mx-auto px-5 py-20 text-center"><p className="text-taupe mb-4">Sepetiniz boş</p><Link href="/sayfa" className="text-sm underline">Alışverişe dön</Link></div>;

  const subtotal = cart.total;
  const shipping = subtotal >= 100000 ? 0 : 250;
  const instRate = INSTALLMENTS.find(i => i.m === inst)?.r || 0;
  const instFee = Math.round(subtotal * instRate / 100);
  const total = subtotal + shipping + instFee;

  const handleSubmit = async () => {
    if (!addr.firstName || !addr.lastName || !addr.phone || !addr.address || !addr.city) {
      toast.error("Lütfen adres bilgilerini doldurun"); return;
    }
    if (payMethod === "card" && (!card.holderName || !card.number || !card.expireMonth || !card.cvc)) {
      toast.error("Lütfen kart bilgilerini doldurun"); return;
    }

    setSubmitting(true);
    try {
      // 1. Adres kaydet
      const addrRes = await fetch("/api/addresses", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addr, title: "Teslimat", zipCode: addr.zip }),
      });
      const savedAddr = await addrRes.json();

      // 2. Sipariş oluştur
      const order = await createOrder({
        addressId: savedAddr.id,
        paymentMethod: payMethod === "card" ? "CREDIT_CARD" : payMethod.toUpperCase(),
        installments: inst,
        couponCode: coupon || undefined,
      });

      // 3. iyzico ile ödeme başlat
      if (payMethod === "card") {
        const payRes = await fetch("/api/payment", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, card, installment: inst }),
        });
        const payData = await payRes.json();

        if (payData.threeDSHtmlContent) {
          // 3D Secure sayfasını aç
          const decoded = atob(payData.threeDSHtmlContent);
          const w = window.open("", "_self");
          w?.document.write(decoded);
          return;
        }
        toast.error(payData.error || "Ödeme başlatılamadı");
      } else {
        // iyzico/shopier → yönlendirme sayfası
        router.push(`/odeme/basarili?order=${order.orderNumber}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    }
    setSubmitting(false);
  };

  const u = (f: string, v: string) => setAddr(p => ({...p, [f]: v}));
  const uc = (f: string, v: string) => setCard(p => ({...p, [f]: v}));

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <nav className="text-[11px] text-taupe tracking-wide flex gap-2 mb-8">
        <Link href="/" className="hover:text-[#1a1a1a]">Ana Sayfa</Link><span>/</span><span>Ödeme</span>
      </nav>
      <h1 className="font-serif text-4xl text-center mb-12">Ödeme</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <div>
          {/* Address */}
          <h2 className="font-serif text-[22px] mb-6 pb-3 border-b border-black/[0.08]">Teslimat Adresi</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Ad" value={addr.firstName} onChange={v => u("firstName",v)} placeholder="Adınız" />
            <Field label="Soyad" value={addr.lastName} onChange={v => u("lastName",v)} placeholder="Soyadınız" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="E-posta" value={addr.email} onChange={v => u("email",v)} placeholder="ornek@email.com" type="email" />
            <Field label="Telefon" value={addr.phone} onChange={v => u("phone",v)} placeholder="+90 5XX XXX XX XX" />
          </div>
          <Field label="Adres" value={addr.address} onChange={v => u("address",v)} placeholder="Mahalle, sokak, bina no" full />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">İl</label>
              <select value={addr.city} onChange={e => u("city",e.target.value)} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent">
                <option value="">İl Seçiniz</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="İlçe" value={addr.district} onChange={v => u("district",v)} placeholder="İlçe" />
          </div>
          <div className="max-w-[200px]"><Field label="Posta Kodu" value={addr.zip} onChange={v => u("zip",v)} placeholder="34000" /></div>

          {/* Payment method */}
          <h2 className="font-serif text-[22px] mb-6 pb-3 border-b border-black/[0.08] mt-10">Ödeme Yöntemi</h2>
          <div className="flex flex-col gap-3 mb-6">
            {[{id:"card",n:"Kredi / Banka Kartı",d:"Visa, Mastercard, Troy"},{id:"iyzico",n:"iyzico ile Öde",d:"Hızlı ve güvenli"},{id:"shopier",n:"Shopier",d:"Alternatif ödeme"}].map(m => (
              <button key={m.id} onClick={() => setPayMethod(m.id)} className={`flex items-center gap-3 p-4 border transition-all text-left ${payMethod===m.id?"border-[#1a1a1a] bg-grey-light":"border-black/10 hover:border-black/30"}`}>
                <span className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center ${payMethod===m.id?"border-[#1a1a1a]":"border-black/30"}`}>
                  {payMethod===m.id && <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a]" />}
                </span>
                <div><p className="text-sm">{m.n}</p><p className="text-[11px] text-taupe">{m.d}</p></div>
              </button>
            ))}
          </div>

          {/* Card form */}
          {payMethod === "card" && <>
            <Field label="Kart Üzerindeki İsim" value={card.holderName} onChange={v => uc("holderName",v)} placeholder="AD SOYAD" full />
            <Field label="Kart Numarası" value={card.number} onChange={v => uc("number",v)} placeholder="XXXX XXXX XXXX XXXX" full />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Ay" value={card.expireMonth} onChange={v => uc("expireMonth",v)} placeholder="MM" />
              <Field label="Yıl" value={card.expireYear} onChange={v => uc("expireYear",v)} placeholder="YY" />
              <Field label="CVV" value={card.cvc} onChange={v => uc("cvc",v)} placeholder="•••" type="password" />
            </div>

            <h2 className="font-serif text-[22px] mb-6 pb-3 border-b border-black/[0.08] mt-8">Taksit Seçenekleri</h2>
            <table className="w-full text-sm mb-6">
              <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe text-left border-b border-black/[0.08]"><th className="pb-2.5 w-8"></th><th className="pb-2.5">Taksit</th><th className="pb-2.5">Aylık</th><th className="pb-2.5">Toplam</th></tr></thead>
              <tbody>{INSTALLMENTS.map(i => { const fee = Math.round(subtotal*i.r/100); const t = subtotal+fee; const monthly = i.m>1?Math.round(t/i.m):t; return (
                <tr key={i.m} onClick={() => setInst(i.m)} className={`cursor-pointer border-b border-black/[0.04] hover:bg-grey-light ${inst===i.m?"font-medium":""}`}>
                  <td className="py-3"><span className={`w-4 h-4 rounded-full border-[1.5px] inline-flex items-center justify-center ${inst===i.m?"border-[#1a1a1a]":"border-black/30"}`}>{inst===i.m && <span className="w-2 h-2 rounded-full bg-[#1a1a1a]" />}</span></td>
                  <td className="py-3">{i.l}</td><td className="py-3">₺{monthly.toLocaleString("tr-TR")}</td><td className="py-3">₺{t.toLocaleString("tr-TR")}</td>
                </tr>); })}</tbody>
            </table>
          </>}

          {payMethod === "iyzico" && <div className="p-8 bg-grey-light text-center"><p className="font-serif text-xl mb-2">iyzico</p><p className="text-sm text-taupe">Siparişi onayladığınızda iyzico güvenli ödeme sayfasına yönlendirileceksiniz.</p></div>}
          {payMethod === "shopier" && <div className="p-8 bg-grey-light text-center"><p className="font-serif text-xl mb-2">Shopier</p><p className="text-sm text-taupe">Shopier güvenli ödeme altyapısı ile ödemenizi tamamlayabilirsiniz.</p></div>}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-grey-light p-8 sticky top-24">
            <h3 className="font-serif text-xl mb-6 pb-3 border-b border-black/[0.08]">Sipariş Özeti</h3>
            {cart.items.map((item: any) => (
              <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b border-black/[0.04]">
                <div className="w-[70px] h-[90px] relative bg-beige flex-shrink-0 overflow-hidden">
                  <Image src={item.product.images[0]?.url || ""} alt="" fill className="object-cover" sizes="70px" />
                </div>
                <div>
                  <p className="text-sm mb-1">{item.product.name}</p>
                  <p className="text-[11px] text-taupe">Beden: {item.variant.size} | Renk: {item.variant.colorName} | Adet: {item.quantity}</p>
                  <p className="text-sm mt-1">₺{(item.product.price * item.quantity).toLocaleString("tr-TR")}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between text-sm mb-2"><span>Ara Toplam</span><span>₺{subtotal.toLocaleString("tr-TR")}</span></div>
            <div className="flex justify-between text-sm mb-2"><span>Kargo</span><span className={shipping===0?"text-[#2d6a4f]":""}>{shipping===0?"Ücretsiz":`₺${shipping}`}</span></div>
            {instFee > 0 && <div className="flex justify-between text-sm mb-2"><span>Taksit Farkı</span><span>₺{instFee.toLocaleString("tr-TR")}</span></div>}
            <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-[#1a1a1a]"><span>Toplam</span><span>₺{total.toLocaleString("tr-TR")}</span></div>

            <button onClick={handleSubmit} disabled={submitting} className="w-full mt-6 py-[18px] bg-[#1a1a1a] text-white text-xs tracking-luxury uppercase flex items-center justify-center gap-2 hover:bg-[#333] disabled:bg-[#ccc]">
              <Lock size={14} /> {submitting ? "İşleniyor..." : "Siparişi Onayla"}
            </button>
            <p className="text-center text-[11px] text-taupe mt-4">Güvenli ödeme ile korunmaktasınız</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type="text", full=false }: any) {
  return (
    <div className={`mb-4 ${full?"":"" }`}>
      <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] transition-colors bg-transparent" />
    </div>
  );
}
