export type CurrencyCode = "IDR" | "USD" | "SGD" | "AUD";

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string; rateFromIdr: number }[] = [
  { code: "IDR", label: "Rupiah (IDR)", symbol: "Rp", rateFromIdr: 1 },
  { code: "USD", label: "US Dollar (USD)", symbol: "$", rateFromIdr: 1 / 15800 },
  { code: "SGD", label: "Singapore Dollar (SGD)", symbol: "S$", rateFromIdr: 1 / 11700 },
  { code: "AUD", label: "Australian Dollar (AUD)", symbol: "A$", rateFromIdr: 1 / 10300 },
];

export const DEFAULT_CURRENCY: CurrencyCode = "IDR";

/**
 * Static approximate rates for the scaffold. Replace with a live daily fetch
 * from a free FX API (e.g. open.er-api.com) cached server-side per PRD §5.6/§8.
 */
export function convertFromIdr(amountIdr: number, currency: CurrencyCode): number {
  const rate = CURRENCIES.find((c) => c.code === currency)?.rateFromIdr ?? 1;
  return amountIdr * rate;
}

export function formatMoney(amountIdr: number, currency: CurrencyCode): string {
  const converted = convertFromIdr(amountIdr, currency);
  if (currency === "IDR") {
    return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(converted)}`;
  }
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "";
  return `${symbol}${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted)}`;
}
