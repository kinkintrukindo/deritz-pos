import type { TransactionSettings, FeeConfig } from "@/lib/types-settings";

export function calculateFee(basAmount: number, config: FeeConfig): number {
  if (config.type === 'percentage') {
    const feeAmount = Math.round(basAmount * (config.value / 100));

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
    return calculateFee(subtotal, settings.shipping.domestic);
  }

  // International - check for country-specific exception first
  if (countryId) {
    const exception = settings.shipping.international.exceptions.find(
      (exc) => exc.countryId === countryId
    );

    if (exception) {
      return calculateFee(subtotal, exception.fee);
    }
  }

  // Use default for all other countries
  return calculateFee(subtotal, settings.shipping.international.default);
}
