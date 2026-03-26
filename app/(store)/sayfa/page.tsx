import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import { FilterSidebar } from "./filters";

type Props = {
  searchParams: {
    sort?: string; search?: string; minPrice?: string; maxPrice?: string;
    color?: string; size?: string; page?: string;
  };
};

export const metadata = { title: "Sandaletler | Ülkü Yaman Collection" };

export default async function CategoryPage({ searchParams }: Props) {
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1");
  const limit = 12;

  const where: any = { active: true };

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) where.price.gte = parseInt(searchParams.minPrice);
    if (searchParams.maxPrice) where.price.lte = parseInt(searchParams.maxPrice);
  }
  if (searchParams.color) {
    where.variants = { some: { colorName: searchParams.color } };
  }
  if (searchParams.size) {
    where.variants = { ...where.variants, some: { ...where.variants?.some, size: parseInt(searchParams.size) } };
  }

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "popular" ? { sales: "desc" } :
    { createdAt: "desc" };

  const [products, total, allVariants] = await Promise.all([
    db.product.findMany({
      where, orderBy, skip: (page - 1) * limit, take: limit,
      include: { images: { orderBy: { order: "asc" } }, variants: true },
    }),
    db.product.count({ where }),
    // Tüm aktif ürünlerin renk ve beden seçeneklerini al (filtre için)
    db.productVariant.findMany({
      where: { product: { active: true }, stock: { gt: 0 } },
      select: { color: true, colorName: true, size: true },
    }),
  ]);

  // Benzersiz renkler ve bedenler
  const colors = Array.from(new Map(allVariants.map(v => [v.colorName, { color: v.color, name: v.colorName }])).values());
  const sizes = [...new Set(allVariants.map(v => v.size))].sort((a, b) => a - b);

  // Fiyat aralığı
  const priceRange = await db.product.aggregate({
    where: { active: true },
    _min: { price: true },
    _max: { price: true },
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-[#f5f0eb] py-14 px-10 text-center">
        <p className="text-[10px] tracking-[5px] uppercase text-[#8b7d6b] mb-2">Koleksiyon</p>
        <h1 className="font-serif text-[42px] font-light">Sandaletler</h1>
        <p className="text-xs text-[#8b7d6b] tracking-[1.5px] mt-2">{total} Ürün</p>
      </div>

      {/* Content: Sidebar + Grid */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10">
        <div className="flex gap-10">
          
          {/* Sol: Filtreler */}
          <FilterSidebar
            colors={colors}
            sizes={sizes}
            minPrice={priceRange._min.price || 0}
            maxPrice={priceRange._max.price || 50000}
            currentFilters={searchParams}
          />

          {/* Sağ: Ürünler */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex justify-between items-center pb-5 mb-8 border-b border-black/[0.08]">
              <p className="text-sm text-[#8b7d6b]">{total} ürün gösteriliyor</p>
              <form>
                <select name="sort" defaultValue={sort} className="text-xs tracking-wide border border-black/15 px-4 py-2 bg-transparent appearance-none pr-8 cursor-pointer"
                  onChange="this.form.submit()" >
                  <option value="newest">En Yeni</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="popular">En Çok Satan</option>
                </select>
              </form>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 text-[#8b7d6b]">
                <p className="text-lg mb-2">Ürün bulunamadı</p>
                <p className="text-sm">Filtreleri değiştirmeyi deneyin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {total > limit && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                  <a key={i} href={`/sayfa?sort=${sort}&page=${i + 1}${searchParams.color ? `&color=${searchParams.color}` : ""}${searchParams.size ? `&size=${searchParams.size}` : ""}`}
                    className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${page === i + 1 ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-black/15 hover:border-black"}`}>
                    {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
