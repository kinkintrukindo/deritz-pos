import type { TransactionSettings, FeeConfig } from "@/lib/types-settings";

const IDR_TO_USD_RATE = 15250; // Standard exchange rate for calculations

export function calculateFee(
  basAmount: number,
  config: FeeConfig,
  options?: { idr?: boolean; isInternational?: boolean }
): number {
  if (config.type === 'percentage') {
    let workingAmount = basAmount;

    // Determine currency (default to USD for international if not specified)
    const currency = config.currency || (options?.isInternational ? 'USD' : 'IDR');

    // If amount is in IDR but config is in foreign currency, convert
    if (options?.idr && currency !== 'IDR') {
      workingAmount = basAmount / IDR_TO_USD_RATE;
    }

    const feeAmount = Math.round(workingAmount * (config.value / 100));

    // Apply min/max caps
    let finalFee = feeAmount;
    if (config.minCap && finalFee < config.minCap) {
      finalFee = config.minCap;
    }
    if (config.maxCap && finalFee > config.maxCap) {
      finalFee = config.maxCap;
    }

    return finalFee;
  } else {
    // Fixed amount
    return config.value;
  }
}

export function calculateTransactionFee(
  subtotal: number,
  settings: TransactionSettings
): number {
  if (!settings.transactionFee.enabled) {
    return 0;
  }

  return calculateFee(subtotal, settings.transactionFee.fee);
}

export function calculateShippingFee(
  subtotal: number,
  shippingType: 'domestic' | 'international',
  countryId?: string,
  settings?: TransactionSettings
): number {
  if (!settings || settings.shipping.enabled) {
    // Midtrans enabled, no additional fee calculation needed
    return 0;
  }

  if (shippingType === 'domestic') {
    return calculateFee(subtotal, settings.shipping.domestic, { idr: true });
  }

  // International - check for country-specific exception first
  if (countryId) {
    const exception = settings.shipping.international.exceptions.find(
      (exc) => exc.countryId === countryId
    );

    if (exception) {
      return calculateFee(subtotal, exception.fee, { idr: true, isInternational: true });
    }
  }

  // Use default for all other countries
  return calculateFee(subtotal, settings.shipping.international.default, {
    idr: true,
    isInternational: true,
  });
}
