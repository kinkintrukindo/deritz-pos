"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export function CartLink() {
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <Link
      href="/cart"
      className="flex items-center gap-1.5 text-[9px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors whitespace-nowrap"
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"
        />
      </svg>
      <span>Bag{count > 0 ? ` (${count})` : ""}</span>
    </Link>
  );
}
