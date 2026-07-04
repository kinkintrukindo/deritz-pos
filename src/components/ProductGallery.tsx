"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: ProductImage[];
  alt: string;
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[3/4] bg-surface">
        {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}
        <Image
          src={current.url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain"
          priority
        />
      </div>

      {current.caption && (
        <p className="mt-3 text-sm text-graphite italic">{current.caption}</p>
      )}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative aspect-square overflow-hidden border transition-colors ${
                i === active ? "border-ink" : "border-transparent hover:border-mist"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
