"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Price } from "@/components/Price";

export default function CartPage() {
  const { lines, removeLine } = useCart();
  const total = lines.reduce(
    (sum, l) => sum + (l.unitPriceIdr + l.surchargeIdr) * l.qty,
    0
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">Your Bag is Empty</h1>
        <p className="text-graphite mb-8">
          Browse the collection and add a piece to begin.
        </p>
        <Link
          href="/collection"
          className="inline-block border border-ink text-ink text-xs tracking-wide-label uppercase px-8 py-3 hover:bg-ink hover:text-white transition-colors"
        >
          Explore the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-16">
      <h1 className="text-3xl font-medium tracking-tight text-ink mb-10">Your Bag</h1>

      <div className="divide-y divide-mist border-y border-mist">
        {lines.map((line) => (
          <div key={line.lineId} className="py-6 flex gap-5">
            <div className="relative h-28 w-24 shrink-0 bg-surface">
              <Image src={line.image} alt={line.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-ink">{line.name}</p>
              <p className="text-xs text-graphite mt-1">
                {line.sizeMode === "preset"
                  ? `Size ${line.sizePreset}`
                  : `Custom — Bust ${line.measurements.bust}, Waist ${line.measurements.waist}, Hip ${line.measurements.hip} ${line.measurements.unit}`}
              </p>
              <button
                type="button"
                onClick={() => removeLine(line.lineId)}
                className="text-xs text-graphite underline mt-2 hover:text-ink"
              >
                Remove
              </button>
            </div>
            <Price amountIdr={(line.unitPriceIdr + line.surchargeIdr) * line.qty} className="text-ink" />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-baseline pt-8">
        <span className="text-graphite">Subtotal</span>
        <Price amountIdr={total} className="text-2xl font-medium text-ink" />
      </div>
      <p className="text-xs text-graphite mt-2">
        Shipping estimate and payment are calculated at checkout.
      </p>

      <Link
        href="/checkout"
        className="mt-8 block w-full text-center bg-ink text-white text-xs tracking-wide-label uppercase py-4 hover:bg-gold transition-colors"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
