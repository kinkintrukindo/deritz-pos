import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "@/components/Price";
import { ProductBadges } from "@/components/ProductBadges";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/collection/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {(product.isNew || product.isPromo || product.soldOut) && (
          <div className="absolute top-3 left-3 z-10">
            <ProductBadges product={product} />
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
            product.soldOut ? "opacity-60" : ""
          }`}
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-medium text-ink leading-snug">{product.name}</h3>
      </div>
      <Price amountIdr={product.basePriceIdr} className="text-sm text-graphite" />
    </Link>
  );
}
