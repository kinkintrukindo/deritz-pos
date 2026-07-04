"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { CurrencyCode, DEFAULT_CURRENCY } from "@/lib/currency";

const CurrencyContext = createContext<{
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode | null;
    // Reading localStorage after mount (not during render) avoids an SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setCurrencyState(stored);
  }, []);

  function setCurrency(c: CurrencyCode) {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
