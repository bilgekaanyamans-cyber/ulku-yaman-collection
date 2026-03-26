export const metadata = { title: "KVKK Aydınlatma Metni | Ülkü Yaman Collection" };

export default function KVKKPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <h1 className="font-serif text-4xl mb-8">KVKK Aydınlatma Metni</h1>
      <div className="prose prose-sm text-taupe leading-relaxed space-y-4">
        <p><strong className="text-[#1a1a1a]">Veri Sorumlusu:</strong> Ülkü Yaman Collection (&ldquo;Şirket&rdquo;)</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">1. Kişisel Verilerin İşlenme Amacı</h2>
        <p>Kişisel verileriniz; sipariş süreçlerinin yürütülmesi, ürün ve hizmetlerin sunulması, müşteri ilişkileri yönetimi, yasal yükümlülüklerin yerine getirilmesi, bilgi güvenliği süreçlerinin yürütülmesi ve iletişim faaliyetlerinin yürütülmesi amaçlarıyla işlenmektedir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">2. İşlenen Kişisel Veriler</h2>
        <p>Ad, soyad, e-posta adresi, telefon numarası, teslimat adresi, sipariş bilgileri, ödeme bilgileri (kart bilgileri şirketimiz tarafından saklanmaz, ödeme altyapısı tarafından işlenir), IP adresi ve çerez bilgileri.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">3. Kişisel Verilerin Aktarılması</h2>
        <p>Kişisel verileriniz; kargo firmaları (sipariş teslimatı), ödeme kuruluşları (ödeme işlemleri), yasal merciler (yasal zorunluluk) ile paylaşılabilir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">4. Haklarınız</h2>
        <p>6698 sayılı KVKK kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmiş ise buna ilişkin bilgi talep etme, işlenme amacını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme, silinmesini veya yok edilmesini isteme haklarınız bulunmaktadır.</p>

        <p className="mt-8"><strong className="text-[#1a1a1a]">İletişim:</strong> info@ulkuyaman.com</p>
        <p className="text-xs mt-4">Son güncelleme: Mart 2026</p>
      </div>
    </div>
  );
}
