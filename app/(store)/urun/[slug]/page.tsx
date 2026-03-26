import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGallery } from "./gallery";
import { ProductInfo } from "./product-info";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} | Ülkü Yaman Collection`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: [{ colorName: "asc" }, { size: "asc" }] },
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) notFound();

  // Görüntüleme sayısını artır
  await db.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  });

  // Benzersiz renkler
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color, { color: v.color, colorName: v.colorName }])).values()
  );

  // Ortalama puan
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="max-w-[1400px] mx-auto px-5 md:px-10 py-5 text-[11px] text-taupe tracking-wide flex items-center gap-2">
        <a href="/" className="hover:text-[#1a1a1a]">Ana Sayfa</a>
        <span>/</span>
        <a href="/sayfa" className="hover:text-[#1a1a1a]">Sandaletler</a>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      {/* Product */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo
          product={product}
          colors={colors}
          avgRating={avgRating}
          reviewCount={product._count.reviews}
        />
      </div>
    </div>
  );
}
