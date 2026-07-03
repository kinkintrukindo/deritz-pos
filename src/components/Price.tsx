"use client";

import { formatMoney } from "@/lib/currency";
import { useCurrency } from "@/components/CurrencyProvider";

export function Price({ amountIdr, className }: { amountIdr: number; className?: string }) {
  const { currency } = useCurrency();
  return <span className={className}>{formatMoney(amountIdr, currency)}</span>;
}
