"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { SizeSelector, type SizeSelection } from "@/components/SizeSelector";
import { Price } from "@/components/Price";
import { useCart } from "@/components/CartProvider";

export function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addLine } = useCart();
  const [selection, setSelection] = useState<SizeSelection>({
    sizeMode: "preset",
    sizePreset: "S",
    measurements: { ...product.sizePresets.S, unit: "cm" },
  });
  const [added, setAdded] = useState(false);

  const surcharge = selection.sizeMode === "custom" ? product.madeToMeasureSurchargeIdr : 0;
  const total = product.basePriceIdr + surcharge;

  if (product.soldOut) {
    return (
      <div>
        <p className="text-xs tracking-wide-label uppercase text-graphite mb-3">
          Size &amp; Measurements
        </p>
        <div className="flex justify-between text-base text-ink font-medium mb-6">
          <span>Price</span>
          <Price amountIdr={product.basePriceIdr} />
        </div>
        <p className="text-sm text-graphite mb-6">
          This piece is currently sold out and cannot be added to your bag.
        </p>
        <button
          type="button"
          disabled
          className="w-full bg-mist text-graphite text-xs tracking-wide-label uppercase py-4 cursor-not-allowed"
        >
          Sold Out
        </button>
      </div>
    );
  }

  function handleAddToCart() {
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPriceIdr: product.basePriceIdr,
      surchargeIdr: surcharge,
      sizeMode: selection.sizeMode,
      sizePreset: selection.sizePreset,
      measurements: selection.measurements,
      qty: 1,
    });
    setAdded(true);
  }

  return (
    <div>
      <p className="text-xs tracking-wide-label uppercase text-graphite mb-3">
        Size &amp; Measurements
      </p>
      <SizeSelector
        onSizeChange={setSelection}
        defaultSize={selection.sizePreset}
      />

      <div className="mt-8 border-t border-mist pt-6 space-y-2">
        <div className="flex justify-between text-base text-ink font-medium">
          <span>Price</span>
          <Price amountIdr={total} />
        </div>
        <p className="text-xs text-graphite pt-1">
          Estimated lead time: {product.leadTimeDays}
          {selection.sizeMode === "custom" ? " + 7" : ""} days. Shipping is
          estimated at checkout.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 bg-ink text-white text-xs tracking-wide-label uppercase py-4 hover:bg-gold transition-colors"
        >
          Add to Bag
        </button>
        {added && (
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="flex-1 border border-ink text-ink text-xs tracking-wide-label uppercase py-4 hover:bg-ink hover:text-white transition-colors"
          >
            View Bag
          </button>
        )}
      </div>
    </div>
  );
}
