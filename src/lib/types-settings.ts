export type FeeType = 'percentage' | 'fixed';

export interface FeeConfig {
  type: FeeType;
  value: number; // percentage (0-100) or fixed amount
  minCap?: number; // minimum fee for percentage
  maxCap?: number; // maximum fee for percentage
  currency?: string; // for international fees: USD, SGD, CNY, etc
}

export interface ShippingConfig {
  enabled: boolean; // use Midtrans or manual
  domestic: FeeConfig;
  international: {
    default: FeeConfig;
    exceptions: Array<{
      countryId: string;
      countryName: string;
      fee: FeeConfig;
    }>;
  };
}

export interface TransactionFeeConfig {
  enabled: boolean;
  fee: FeeConfig;
}

export interface TransactionSettings {
  shipping: ShippingConfig;
  transactionFee: TransactionFeeConfig;
  lastUpdated: string;
  updatedBy: string;
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  enabled: true, // Use Midtrans by default
  domestic: {
    type: 'percentage',
    value: 0,
    minCap: 10000,
    maxCap: 500000,
  },
  international: {
    default: {
      type: 'fixed',
      value: 0,
      currency: 'USD',
    },
    exceptions: [],
  },
};

export const DEFAULT_TRANSACTION_FEE_CONFIG: TransactionFeeConfig = {
  enabled: false,
  fee: {
    type: 'percentage',
    value: 0,
    minCap: 5000,
    maxCap: 100000,
  },
};

export const DEFAULT_SETTINGS: TransactionSettings = {
  shipping: DEFAULT_SHIPPING_CONFIG,
  transactionFee: DEFAULT_TRANSACTION_FEE_CONFIG,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system',
};
