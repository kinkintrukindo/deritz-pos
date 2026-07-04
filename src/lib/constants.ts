// Storage keys for client-side persistence
export const STORAGE_KEYS = {
  CART: "deritz-cart",
  CURRENCY: "deritz-currency",
  GUEST_EMAIL: "deritz_guest_email",
} as const;

// Supabase table keys
export const SUPABASE_KEYS = {
  SETTINGS: "site_settings",
  PRODUCTS: "products",
  COLLECTIONS: "collections",
  ORDERS: "orders",
} as const;

// Shipping constants
export const SHIPPING = {
  // Domestic shipping costs (in IDR)
  DOMESTIC: {
    JNE_OKE: 150000,
    TIKI_REGULAR: 140000,
    POS_REGULAR: 120000,
  },
  // International shipping costs (in IDR)
  INTERNATIONAL: {
    USA: 1200000,
    UK: 850000,
    AUSTRALIA: 1100000,
    CANADA: 1200000,
    SINGAPORE: 800000,
    MALAYSIA: 1000000,
    JAPAN: 2000000,
  },
  // Origin subdistrict ID: DUKUH PAKIS, SURABAYA, 60225
  ORIGIN_CITY_CODE: "69229",
  // Default product dimensions (L x W x H in cm)
  DEFAULT_DIMENSION_L: 20,
  DEFAULT_DIMENSION_W: 20,
  DEFAULT_DIMENSION_H: 10,
  // Default product weight (kg)
  DEFAULT_WEIGHT_KG: 5,
  // Volumetric weight divisor (kg per cm³)
  VOLUMETRIC_DIVISOR: 6000,
  // Max file size for uploads (50MB)
  MAX_FILE_SIZE: 50 * 1000 * 1000,
} as const;

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  TOAST_AUTO_FADE: 4000,
  ADMIN_SAVE_DELAY_BEFORE_REDIRECT: 1500,
  SHARE_BUTTON_COPY_FEEDBACK: 2000,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  RAJAONGKIR_STARTER: "https://api.rajaongkir.com/starter/cost",
  RAJAONGKIR_BASIC: "https://api.rajaongkir.com/basic/cost",
  RAJAONGKIR_BASIC_INTL: "https://api.rajaongkir.com/basic/internationalCost",
} as const;

// Fallback URLs (for development/testing)
export const FALLBACK_URLS = {
  APP: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;
