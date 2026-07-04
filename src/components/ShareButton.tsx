'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';

interface ShareButtonProps {
  product: Product;
}

export function ShareButton({ product }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/collection/${product.slug}`;
    const title = product.name;
    const text = `Check out ${title} from De Ritz`;

    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch (error) {
        // User cancelled share, fall through to copy link
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="text-xs tracking-wide-label uppercase px-4 py-2.5 border border-ink text-ink hover:bg-ink hover:text-white transition-colors flex items-center gap-2"
      title="Share this product"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}
