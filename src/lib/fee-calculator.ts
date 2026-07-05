import type { TransactionSettings, FeeConfig } from "@/lib/types-settings";

const IDR_TO_USD_RATE = 15250; // Standard exchange rate for calculations

// Map RajaOngkir V2 country IDs to ISO country codes
const RAJAONGKIR_ID_TO_ISO: Record<string, string> = {
  '152': 'SG',  // Singapore
  '36': 'CN',   // China
  '9': 'AU',    // Australia
  '30': 'CA',   // Canada
  '91': 'JP',   // Japan
  '66': 'DE',   // Germany
  '61': 'FR',   // France
  '89': 'IT',   // Italy
  '156': 'ES',  // Spain
  '125': 'NL',  // Netherlands
  '16': 'BE',   // Belgium
  '10': 'AT',   // Austria
  '223': 'CH',  // Switzerland (to verify)
  '189': 'SE',  // Sweden (to verify)
  '142': 'NO',  // Norway (to verify)
  '51': 'DK',   // Denmark (to verify)
  '54': 'FI',   // Finland (to verify)
  '130': 'PL',  // Poland (to verify)
  '39': 'CZ',   // Czech Republic (to verify)
  '84': 'GR',   // Greece (to verify)
  '144': 'PT',  // Portugal (to verify)
  '131': 'PH',  // Philippines (to verify)
  '147': 'MX',  // Mexico (to verify)
  '241': 'VN',  // Vietnam (to verify)
  '214': 'TH',  // Thailand (to verify)
  '124': 'MY',  // Malaysia (to verify)
  '103': 'ID',  // Indonesia
  '233': 'US',  // United States
  '175': 'KR',  // South Korea (to verify)
};

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

  // International - convert RajaOngkir country ID to ISO code
  let isoCountryCode = countryId;
  if (countryId && RAJAONGKIR_ID_TO_ISO[countryId]) {
    isoCountryCode = RAJAONGKIR_ID_TO_ISO[countryId];
  }

  // Check for country-specific exception first
  if (isoCountryCode) {
    const exception = settings.shipping.international.exceptions.find(
      (exc) => exc.countryId === isoCountryCode
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
