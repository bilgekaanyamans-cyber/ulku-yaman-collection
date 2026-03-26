"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/lib/api";

type Variant = {
  id: string;
  color: string;
  colorName: string;
  size: number;
  stock: number;
};

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    comparePrice?: number | null;
    description: string;
    variants: Variant[];
  };
  colors: { color: string; colorName: string }[];
  avgRating: number;
  reviewCount: number;
};

export function ProductInfo({ product, colors, avgRating, reviewCount }: Props) {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.colorName || "");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Bu renk için mevcut bedenler
  const availableSizes = product.variants
    .filter((v) => v.colorName === selectedColor)
    .sort((a, b) => a.size - b.size);

  // Seçili varyant
  const selectedVariant = product.variants.find(
    (v) => v.colorName === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/giris");
      return;
    }
    if (!selectedVariant) return;

    setLoading(true);
    try {
      await addToCart(selectedVariant.id);
      toast.success("Sepete eklendi");
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-5 flex flex-col">
      {/* Brand */}
      <p className="text-[11px] font-medium tracking-luxury uppercase text-taupe mb-2">
        Ülkü Yaman Collection
      </p>

      {/* Name */}
      <h1 className="font-serif text-[32px] leading-tight mb-4">{product.name}</h1>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= Math.round(avgRating) ? "fill-sand text-sand" : "text-black/15"}
              />
            ))}
          </div>
          <span className="text-xs text-taupe">({reviewCount} değerlendirme)</span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xl">₺{product.price.toLocaleString("tr-TR")}</span>
        {product.comparePrice && (
          <span className="text-sm text-taupe line-through">
            ₺{product.comparePrice.toLocaleString("tr-TR")}
          </span>
        )}
      </div>

      <hr className="border-black/[0.08] my-0 mb-5" />

      {/* Color selection */}
      <p className="text-[11px] font-medium tracking-wide2 uppercase mb-3">
        Renk — {selectedColor}
      </p>
      <div className="flex gap-3 mb-6">
        {colors.map((c) => (
          <button
            key={c.color}
            onClick={() => {
              setSelectedColor(c.colorName);
              setSelectedSize(null);
            }}
            className={`w-7 h-7 rounded-full border-[1.5px] border-black/15 transition-all ${
              selectedColor === c.colorName
                ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]"
                : "hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-[#1a1a1a]"
            }`}
            style={{ backgroundColor: c.color }}
            title={c.colorName}
          />
        ))}
      </div>

      {/* Size selection */}
      <p className="text-[11px] font-medium tracking-wide2 uppercase mb-3">Beden Seç</p>
      <div className="grid grid-cols-6 gap-2 mb-8">
        {availableSizes.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedSize(v.size)}
            disabled={v.stock === 0}
            className={`py-3 text-sm border transition-all ${
              selectedSize === v.size
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : v.stock === 0
                ? "border-black/10 text-black/25 cursor-not-allowed line-through"
                : "border-black/15 hover:border-black"
            }`}
          >
            {v.size}
          </button>
        ))}
      </div>

      {/* Stock info */}
      {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
        <p className="text-xs text-[#c1121f] mb-3">
          Son {selectedVariant.stock} adet kaldı!
        </p>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || loading || (selectedVariant?.stock === 0)}
        className="w-full py-[18px] bg-[#1a1a1a] text-white text-xs tracking-luxury uppercase transition-all hover:bg-[#333] disabled:bg-[#ccc] disabled:cursor-not-allowed mb-3"
      >
        {loading ? "Ekleniyor..." : selectedSize ? "Sepete Ekle" : "Beden Seçiniz"}
      </button>

      {/* Description */}
      <p className="text-sm leading-relaxed text-taupe mt-6">{product.description}</p>

      <hr className="border-black/[0.08] my-5" />

      {/* Details */}
      <div className="text-xs text-taupe leading-8">
        • Ücretsiz kargo (100.000₺ üzeri)<br />
        • 14 gün içinde koşulsuz iade<br />
        • Orijinal kutu ile teslimat<br />
        • 12 aya varan taksit imkânı
      </div>
    </div>
  );
}
