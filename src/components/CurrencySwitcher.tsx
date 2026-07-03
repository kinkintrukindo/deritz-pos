"use client";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/components/CurrencyProvider";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as typeof currency)}
      aria-label="Currency"
      className="bg-transparent text-xs tracking-wide-label uppercase text-graphite border border-mist rounded-none px-3 py-1.5 focus:outline-none focus:border-ink cursor-pointer"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code}
        </option>
      ))}
    </select>
  );
}
