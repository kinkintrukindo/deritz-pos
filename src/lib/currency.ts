export type CurrencyCode = "IDR" | "USD" | "SGD" | "AUD" | "MYR" | "THB" | "VND" | "EUR" | "PHP" | "CNY" | "JPY" | "KRW";

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string; flag: string; rateFromIdr: number }[] = [
  { code: "IDR", label: "Rupiah", symbol: "Rp", flag: "🇮🇩", rateFromIdr: 1 },
  { code: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸", rateFromIdr: 1 / 15800 },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rateFromIdr: 1 / 2200 },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateFromIdr: 1 / 106 },
  { code: "KRW", label: "Korean Won", symbol: "₩", flag: "🇰🇷", rateFromIdr: 1 / 12 },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rateFromIdr: 1 / 11700 },
  { code: "AUD", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateFromIdr: 1 / 10300 },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", rateFromIdr: 1 / 3550 },
  { code: "THB", label: "Thai Baht", symbol: "฿", flag: "🇹🇭", rateFromIdr: 1 / 450 },
  { code: "VND", label: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", rateFromIdr: 1 / 630 },
  { code: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺", rateFromIdr: 1 / 17200 },
  { code: "PHP", label: "Philippine Peso", symbol: "₱", flag: "🇵🇭", rateFromIdr: 1 / 280 },
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
