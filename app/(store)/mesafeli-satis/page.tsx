export const metadata = { title: "Mesafeli Satış Sözleşmesi | Ülkü Yaman Collection" };

export default function MesafeliSatisPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <h1 className="font-serif text-4xl mb-8">Mesafeli Satış Sözleşmesi</h1>
      <div className="prose prose-sm text-taupe leading-relaxed space-y-4">
        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 1 — Taraflar</h2>
        <p><strong className="text-[#1a1a1a]">Satıcı:</strong> Ülkü Yaman Collection<br />Adres: İstanbul, Türkiye<br />E-posta: info@ulkuyaman.com<br />Telefon: +90 212 555 00 00</p>
        <p><strong className="text-[#1a1a1a]">Alıcı:</strong> Sipariş formunda belirtilen kişi.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 2 — Sözleşme Konusu</h2>
        <p>İşbu sözleşmenin konusu, Alıcı&apos;nın Satıcı&apos;ya ait web sitesinden elektronik ortamda siparişini verdiği ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 3 — Ürün Bilgileri</h2>
        <p>Ürünlerin cinsi, miktarı, fiyatı ve ödeme bilgileri sipariş sayfasında belirtilmektedir. KDV dahil fiyatlar Türk Lirası (TL) cinsindendir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 4 — Teslimat</h2>
        <p>Ürünler, sipariş onayından itibaren en geç 30 gün içinde teslim edilir. Kargo ücreti 100.000₺ üzeri siparişlerde ücretsizdir. Alıcı adresinde teslim edilir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 5 — Cayma Hakkı</h2>
        <p>Alıcı, ürünün teslim tarihinden itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde Satıcı&apos;ya bildirimde bulunulması ve ürünün kullanılmamış, ambalajının açılmamış olması gerekmektedir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 6 — Ödeme</h2>
        <p>Ödeme kredi kartı veya banka kartı ile yapılır. Taksit seçenekleri ödeme sayfasında sunulur. Taksitli ödemelerde bankanın belirlediği faiz oranları uygulanabilir.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Madde 7 — Yetkili Mahkeme</h2>
        <p>İşbu sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>

        <p className="text-xs mt-8">Son güncelleme: Mart 2026</p>
      </div>
    </div>
  );
}
