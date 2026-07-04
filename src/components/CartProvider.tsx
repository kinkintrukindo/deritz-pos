"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Measurements, SizePresetKey } from "@/lib/types";

const STORAGE_KEY = "deritz-cart";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceIdr: number;
  discountPercent?: number;
  surchargeIdr: number;
  sizeMode: "preset" | "custom";
  sizePreset?: SizePresetKey;
  measurements: Measurements;
  qty: number;
};

const CartContext = createContext<{
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId">) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
}>({
  lines: [],
  addLine: () => {},
  removeLine: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Reading localStorage after mount (not during render) avoids an SSR/client hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLines(JSON.parse(stored));
      } catch {
        // ignore malformed cart
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  function addLine(line: Omit<CartLine, "lineId">) {
    const lineId = `${line.productId}-${Date.now()}`;
    setLines((prev) => [...prev, { ...line, lineId }]);
  }

  function removeLine(lineId: string) {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }

  function clear() {
    setLines([]);
  }

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
