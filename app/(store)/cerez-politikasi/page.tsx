export const metadata = { title: "Çerez Politikası | Ülkü Yaman Collection" };

export default function CookiePolicyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <h1 className="font-serif text-4xl mb-8">Çerez Politikası</h1>
      <div className="prose prose-sm text-taupe leading-relaxed space-y-4">
        <p>Web sitemiz, deneyiminizi iyileştirmek ve hizmetlerimizi sunmak için çerezler kullanmaktadır.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Çerez Nedir?</h2>
        <p>Çerezler, web sitemizi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır. Sitemizin düzgün çalışması, oturumunuzun açık kalması ve tercihlerinizin hatırlanması için kullanılır.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Kullandığımız Çerezler</h2>
        <p><strong className="text-[#1a1a1a]">Zorunlu çerezler:</strong> Giriş yapma, sepet işlemleri gibi temel işlevler için gereklidir. Devre dışı bırakılamaz.</p>
        <p><strong className="text-[#1a1a1a]">Analitik çerezler:</strong> Google Analytics aracılığıyla site kullanım istatistikleri toplar. Anonim veriler işlenir.</p>
        <p><strong className="text-[#1a1a1a]">Tercih çerezleri:</strong> Dil, bölge gibi tercihlerinizi hatırlar.</p>

        <h2 className="font-serif text-xl text-[#1a1a1a] mt-8 mb-3">Çerezleri Yönetme</h2>
        <p>Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Ancak zorunlu çerezleri devre dışı bırakmak sitenin düzgün çalışmamasına neden olabilir.</p>

        <p className="text-xs mt-8">Son güncelleme: Mart 2026</p>
      </div>
    </div>
  );
}
