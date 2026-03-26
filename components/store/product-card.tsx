"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  badge?: string | null;
  images: { url: string; altText?: string }[];
  variants: { color: string; colorName: string }[];
};

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.color, v])).values()
  );

  return (
    <Link
      href={`/urun/${product.slug}`}
      className={`group opacity-0 animate-fade-in stagger-${(index % 4) + 1}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-grey-light mb-4">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Wishlist button */}
        <button
          className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            // TODO: wishlist API call
          }}
        >
          <Heart size={16} />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#1a1a1a] text-white text-[9px] tracking-[1.5px] uppercase px-3.5 py-1.5">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <p className="text-[11px] font-medium tracking-wide2 uppercase mb-1">
        Ülkü Yaman Collection
      </p>
      <p className="font-serif text-base text-taupe mb-2.5">{product.name}</p>
      <p className="text-sm mb-2.5">₺{product.price.toLocaleString("tr-TR")}</p>

      {/* Color dots */}
      <div className="flex gap-2">
        {uniqueColors.map((v, i) => (
          <span
            key={i}
            className="w-3.5 h-3.5 rounded-full border border-black/15"
            style={{ backgroundColor: v.color }}
            title={v.colorName}
          />
        ))}
      </div>
    </Link>
  );
}
