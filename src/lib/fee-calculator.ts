import type { TransactionSettings, FeeConfig } from "@/lib/types-settings";

const IDR_TO_USD_RATE = 15250; // Standard exchange rate for calculations

// Map RajaOngkir country IDs to ISO country codes
const RAJAONGKIR_ID_TO_ISO: Record<string, string> = {
  '179': 'US',  // United States
  '36': 'CN',   // China
  '9': 'AU',    // Australia
  '184': 'SG',  // Singapore
  '124': 'MY',  // Malaysia
  '216': 'TH',  // Thailand
  '246': 'VN',  // Vietnam
  '82': 'DE',   // Germany
  '81': 'FR',   // France
  '106': 'IT',  // Italy
  '201': 'ES',  // Spain
  '160': 'NL',  // Netherlands
  '12': 'BE',   // Belgium
  '14': 'AT',   // Austria
  '218': 'CH',  // Switzerland
  '209': 'SE',  // Sweden
  '157': 'NO',  // Norway
  '58': 'DK',   // Denmark
  '80': 'FI',   // Finland
  '158': 'PL',  // Poland
  '52': 'CZ',   // Czech Republic
  '84': 'GR',   // Greece
  '172': 'PT',  // Portugal
  '175': 'PH',  // Philippines
  '37': 'CA',   // Canada
  '159': 'MX',  // Mexico
  '23': 'KR',   // South Korea
  '118': 'JP',  // Japan
  '103': 'ID',  // Indonesia
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
