import type { Product } from "@/lib/types";

export function ProductBadges({ product }: { product: Product }) {
  if (!product.isNew && !product.isPromo && !product.soldOut) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      {product.soldOut && (
        <span
          className="text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1 font-mono"
          style={{
            backgroundColor: '#c41e3a',
            textShadow: `
              2px 2px 0px rgba(0,0,0,0.3),
              -1px -1px 0px rgba(255,255,255,0.2)
            `,
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          SOLD OUT
        </span>
      )}
      {product.isNew && (
        <span
          className="text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1 font-mono"
          style={{
            backgroundColor: '#9c8438',
            textShadow: `
              2px 2px 0px rgba(0,0,0,0.3),
              -1px -1px 0px rgba(255,255,255,0.2)
            `,
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          NEW
        </span>
      )}
      {product.isPromo && (
        <span
          className="text-white text-[10px] tracking-wide-label uppercase px-2.5 py-1 font-mono"
          style={{
            backgroundColor: '#17181a',
            textShadow: `
              2px 2px 0px rgba(0,0,0,0.3),
              -1px -1px 0px rgba(255,255,255,0.2)
            `,
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          DISCOUNT
        </span>
      )}
    </div>
  );
}
