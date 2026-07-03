"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function CartLink() {
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <Link
      href="/cart"
      className="text-[9px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors whitespace-nowrap"
    >
      Bag{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
