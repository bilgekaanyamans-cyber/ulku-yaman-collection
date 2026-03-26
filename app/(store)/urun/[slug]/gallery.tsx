"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { id: string; url: string; altText?: string | null };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-grey-light group">
        <Image
          src={images[active]?.url || ""}
          alt={images[active]?.altText || productName}
          fill
          className="object-cover transition-transform duration-500 ease-luxury group-hover:scale-[1.04]"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-20 h-[100px] overflow-hidden border transition-all duration-300 ${
                active === i ? "opacity-100 border-[#1a1a1a]" : "opacity-50 border-transparent hover:opacity-80"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
