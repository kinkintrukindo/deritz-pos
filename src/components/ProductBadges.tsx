'use client';

import { useState, useEffect } from 'react';
import type { Product, ProductLabel } from '@/lib/types';

export function ProductBadges({ product }: { product: Product }) {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLabels() {
      if (!product.labelIds || product.labelIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/labels/available');
        if (!res.ok) throw new Error('Failed to load labels');
        const allLabels: ProductLabel[] = await res.json();
        const selected = allLabels.filter(l => product.labelIds?.includes(l.id));
        setLabels(selected);
      } catch (error) {
        console.error('Error loading labels:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLabels();
  }, [product.labelIds]);

  if (loading || labels.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      {labels.map(label => (
        <span
          key={label.id}
          className="text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1 font-mono"
          style={{
            backgroundColor: label.color,
            textShadow: `
              2px 2px 0px rgba(0,0,0,0.3),
              -1px -1px 0px rgba(255,255,255,0.2)
            `,
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          {label.name.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
