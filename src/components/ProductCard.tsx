"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "@/components/Price";
import { ProductBadges } from "@/components/ProductBadges";
import { useWishlist } from "@/components/WishlistProvider";
import { AskStylistButton } from "@/components/AskStylistButton";

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        image: product.image,
        basePriceIdr: product.basePriceIdr,
        slug: product.slug,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <Link href={`/collection/${product.slug}`} className="group block">
      {/* Panel container with rounded corners and shadow */}
      <div className="border border-mist p-4 bg-paper hover:border-ink transition-all rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface mb-4 rounded-lg">
          {(product.isNew || product.isPromo || product.soldOut) && (
            <div className="absolute top-3 left-3 z-10">
              <ProductBadges product={product} />
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded hover:bg-white transition-colors"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                wishlisted ? "fill-gold text-gold" : "text-graphite fill-none"
              }`}
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
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

        {/* Text content */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium text-ink leading-normal"
            style={{ fontFamily: "var(--font-trajan)" }}
          >
            {product.name}
          </h3>
          <Price amountIdr={product.basePriceIdr} className="text-sm text-graphite" />
          <div className="pt-2" onClick={(e) => e.preventDefault()}>
            <AskStylistButton product={product} className="w-full text-center" />
          </div>
        </div>
      </div>
    </Link>
  );
}
