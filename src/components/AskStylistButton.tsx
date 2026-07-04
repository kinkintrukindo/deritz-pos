'use client';

import type { Product } from '@/lib/types';

interface AskStylistButtonProps {
  product: Product;
  className?: string;
}

export function AskStylistButton({ product, className = '' }: AskStylistButtonProps) {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '6281335838367';
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=Hi,%20I%20have%20a%20question%20about%20${encodeURIComponent(product.name)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-xs tracking-wide-label uppercase px-4 py-2.5 border border-ink text-ink hover:bg-ink hover:text-white transition-colors inline-block ${className}`}
    >
      Ask Stylist
    </a>
  );
}
