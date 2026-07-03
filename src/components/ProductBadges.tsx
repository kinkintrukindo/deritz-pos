import type { Product } from "@/lib/types";

export function ProductBadges({ product }: { product: Product }) {
  if (!product.isNew && !product.isPromo && !product.soldOut) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      {product.soldOut && (
        <span className="bg-red-700 text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1">
          Sold Out
        </span>
      )}
      {product.isNew && (
        <span className="bg-gold text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1">
          New Collection
        </span>
      )}
      {product.isPromo && (
        <span className="bg-ink text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1">
          Discount Promo
        </span>
      )}
    </div>
  );
}
