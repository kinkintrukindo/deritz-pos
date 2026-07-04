'use client';

import Link from 'next/link';
import { useWishlist } from '@/components/WishlistProvider';

export function WishlistLink() {
  const { count } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="flex items-center gap-1.5 text-graphite hover:text-ink transition-colors relative"
      title={`Wishlist (${count})`}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}
