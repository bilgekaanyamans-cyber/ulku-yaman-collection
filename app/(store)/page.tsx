import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const featured = await db.product.findMany({
    where: { active: true, featured: true },
    include: { images: { orderBy: { order: "asc" } }, variants: true },
    take: 4,
  });

  const newest = await db.product.findMany({
    where: { active: true },
    include: { images: { orderBy: { order: "asc" } }, variants: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const bestSeller = await db.product.findFirst({
    where: { active: true },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { sales: "desc" },
  });

  return (
    <div>
      {/* ══ HERO — Full viewport, cinematic ══ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&q=85"
            alt="Ülkü Yaman Collection"
            fill
            className="object-cover brightness-[0.75] saturate-[0.85] scale-[1.01] transition-transform duration-[12s] ease-out group-hover:scale-[1.06]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-8 md:px-16 max-w-[1400px] mx-auto">
          <div className="animate-slide-up">
            <p className="text-white/70 text-[11px] tracking-[8px] uppercase mb-6">
              2026 Yaz Koleksiyonu
            </p>
            <h1 className="font-serif text-white text-[clamp(48px,8vw,96px)] font-light leading-[0.95] mb-6 max-w-[700px]">
              Zarafetin<br />Yeni Adımı
            </h1>
            <p className="text-white/70 text-base md:text-lg font-light max-w-[500px] leading-relaxed mb-10">
              Anadolu&apos;nun zengin deri işçiliği geleneğinden ilham alan, el yapımı lüks sandaletler.
            </p>
            <div className="flex gap-4">
              <Link href="/sayfa" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#1a1a1a] text-[11px] tracking-[3px] uppercase hover:bg-white/90 transition-colors">
                Koleksiyonu Keşfet <ArrowRight size={14} />
              </Link>
              <Link href="/hakkimizda" className="inline-flex items-center gap-3 px-10 py-4 border border-white/40 text-white text-[11px] tracking-[3px] uppercase hover:bg-white/10 transition-colors">
                Hikayemiz
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/40 text-[10px] tracking-[3px] uppercase">Keşfet</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ══ USP Strip ══ */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { t: "El Yapımı", d: "Tek tek ustalarca" },
            { t: "Premium Deri", d: "İtalyan ham madde" },
            { t: "Ücretsiz Kargo", d: "100.000₺ üzeri" },
            { t: "Kolay İade", d: "14 gün içinde" },
          ].map((x, i) => (
            <div key={i} className="px-6 py-6 md:py-8 text-center">
              <p className="text-[11px] tracking-[2px] uppercase font-light">{x.t}</p>
              <p className="text-[10px] text-white/40 mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Featured Products ══ */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 pt-24 pb-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[#8b7d6b] mb-2">Seçtiklerimiz</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">Öne Çıkan Parçalar</h2>
          </div>
          <Link href="/sayfa" className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity">
            Tümünü Gör <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="md:hidden text-center mt-8">
          <Link href="/sayfa" className="inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase border-b border-[#1a1a1a] pb-0.5">Tümünü Gör <ArrowRight size={12} /></Link>
        </div>
      </section>

      {/* ══ Editorial Split — Best Seller ══ */}
      {bestSeller && (
        <section className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative min-h-[400px] lg:min-h-0 overflow-hidden group">
            <Image
              src={bestSeller.images[0]?.url || ""}
              alt={bestSeller.name}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center px-10 md:px-20 py-16 bg-[#f5f0eb]">
            <p className="text-[10px] tracking-[5px] uppercase text-[#8b7d6b] mb-4">En Çok Satan</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
              {bestSeller.name}
            </h2>
            <p className="text-sm text-[#8b7d6b] leading-relaxed mb-4 max-w-md">
              {bestSeller.description?.substring(0, 150)}...
            </p>
            <p className="font-serif text-2xl mb-8">₺{bestSeller.price.toLocaleString("tr-TR")}</p>
            <Link
              href={`/urun/${bestSeller.slug}`}
              className="inline-flex items-center gap-3 self-start px-10 py-4 bg-[#1a1a1a] text-white text-[11px] tracking-[3px] uppercase hover:bg-[#333] transition-colors"
            >
              İncele <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ══ Craft Story — Horizontal scroll feel ══ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&q=80", t: "Tasarım", d: "Her model, İstanbul atölyemizde eskiz olarak doğar. Fonksiyon ve estetiğin mükemmel dengesi aranır." },
              { img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", t: "Üretim", d: "Usta ellerde şekillenen İtalyan derisi, geleneksel dikişlerle birleştirilir. Her çift 3 gün sürer." },
              { img: "https://images.unsplash.com/photo-1562273138-f9c383c2c12b?w=600&q=80", t: "Kalite", d: "Son kontrol aşamasında her dikiş, her toka, her detay milimetrik hassasiyetle incelenir." },
            ].map((x, i) => (
              <div key={i} className="group">
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <Image src={x.img} alt={x.t} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-[10px] tracking-[4px] uppercase text-[#8b7d6b] mb-2">0{i + 1}</p>
                <h3 className="font-serif text-2xl mb-3">{x.t}</h3>
                <p className="text-sm text-[#8b7d6b] leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Full Collection ══ */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 pb-24">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[4px] uppercase text-[#8b7d6b] mb-2">Keşfet</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">Tüm Koleksiyon</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {newest.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-12">
          <Link href="/sayfa" className="inline-flex items-center gap-3 px-12 py-4 border border-[#1a1a1a] text-[11px] tracking-[3px] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all">
            Tüm Ürünleri Gör <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══ Instagram CTA ══ */}
      <section className="bg-[#f5f0eb] py-20">
        <div className="text-center">
          <p className="text-[10px] tracking-[5px] uppercase text-[#8b7d6b] mb-3">Bizi Takip Edin</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">@ulkuyaman</h2>
          <p className="text-sm text-[#8b7d6b] mb-8">Yeni modeller, kampanyalar ve atölye hikayeleri için</p>
          <a href="https://instagram.com/ulkuyaman" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-10 py-4 bg-[#1a1a1a] text-white text-[11px] tracking-[3px] uppercase hover:bg-[#333] transition-colors">
            Instagram&apos;da Takip Et
          </a>
        </div>
      </section>
    </div>
  );
}
