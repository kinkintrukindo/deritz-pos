'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/components/WishlistProvider';
import { Price } from '@/components/Price';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h1 className="text-3xl sm:text-5xl font-medium text-ink mb-12" style={{ fontFamily: 'var(--font-trajan)' }}>
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-graphite mb-6">Your wishlist is empty</p>
            <Link
              href="/collection"
              className="inline-block bg-ink text-white px-8 py-3 text-xs tracking-wide-label uppercase hover:bg-graphite transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-graphite mb-8">
              {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {items.map((item) => (
                <div key={item.productId} className="group">
                  <Link href={`/collection/${item.slug}`}>
                    <div className="border border-mist p-4 bg-paper hover:border-ink transition-colors mb-4">
                      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover group-hover:scale-[1.02] transition-transform"
                        />
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <Link href={`/collection/${item.slug}`}>
                      <h3
                        className="text-sm font-medium text-ink hover:text-graphite transition-colors"
                        style={{ fontFamily: 'var(--font-trajan)' }}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <Price amountIdr={item.basePriceIdr} className="text-sm text-graphite" />

                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="text-xs text-graphite hover:text-ink transition-colors underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-mist">
              <Link
                href="/collection"
                className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
