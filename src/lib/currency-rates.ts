// Fetch current currency exchange rates from exchangerate-api.com
// Rates are cached in localStorage and updated daily

const CACHE_KEY = 'currency_rates_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

export async function getCurrentExchangeRates(): Promise<Record<string, number>> {
  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp }: CachedRates = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
        console.log('Using cached exchange rates');
        return rates;
      }
    }

    // Fetch fresh rates from API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch rates');

    const data = await response.json();
    const rates = data.rates;

    // Cache the rates
    const cacheData: CachedRates = {
      rates,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    console.log('Fetched fresh exchange rates from API');
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback rates:', error);
    // Fallback rates (reasonably recent)
    return {
      USD: 1,
      IDR: 17978,
      CNY: 6.8,
      SGD: 1.29,
      AUD: 1.44,
      MYR: 4.85,
      THB: 36,
      VND: 25200,
      EUR: 0.87,
      PHP: 58,
      JPY: 161.27,
      KRW: 1310,
    };
  }
}

// Convert amount from one currency to another
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    console.warn(`Missing rates for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  // Convert to USD first, then to target currency
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}
