export type SizePresetKey = "XS" | "S" | "M" | "L";

export type ProductLabel = {
  id: string;
  name: string;
  color: string; // hex color like #FF0000
  style?: 'typewriter' | 'emboss' | 'bold'; // emboss is old typewriter style
  sortOrder: number;
  active: boolean;
};

export type Measurements = {
  bust: number;
  waist: number;
  hip: number;
  unit: "cm" | "in";
};

export type MeasurementRange = {
  min: number;
  max: number;
};

export type ProductImage = {
  url: string;
  caption: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  lookNumber?: string;
  collection: string;
  description: string;
  details: string[];
  image: string;
  images: ProductImage[];
  basePriceIdr: number;
  madeToMeasureSurchargeIdr: number;
  leadTimeDays: number;
  sizePresets: Record<SizePresetKey, Omit<Measurements, "unit">>;
  measurementRanges: {
    bust: MeasurementRange;
    waist: MeasurementRange;
    hip: MeasurementRange;
  };
  published: boolean;
  isNew: boolean;
  isPromo: boolean;
  soldOut: boolean;
  weightKg?: number;
  dimensionsCm?: {
    width: number;
    height: number;
    depth: number;
  };
  createdAt: string;
  labelIds?: string[]; // IDs of applied product labels
};

export type OrderStatus = "received" | "processed" | "shipped" | "delivered" | "refunded";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  unitPriceIdr: number;
  surchargeIdr: number;
  sizeMode: "preset" | "custom";
  sizePreset?: SizePresetKey;
  measurements: Measurements;
  qty: number;
};

export type OrderCustomer = {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  receivedAt: string;
  processedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  refundedAt?: string;
  deliveryId?: string;
  customer: OrderCustomer;
  items: OrderItem[];
  currency: string;
  subtotalIdr: number;
  shippingIdr: number;
  totalIdr: number;
};

export type SiteSettings = {
  heroMediaUrl: string;
  heroMediaType: "image" | "video";
  heroEyebrow: string;
  heroHeadline: string;
  heroButtonLabel: string;
  featuredProductIds?: string[];
};

export type ChatConversation = {
  id: string;
  userId: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  pinned?: boolean;
  read: boolean;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  userId: string;
  isAdmin: boolean;
  content: string;
  createdAt: string;
  readAt?: string;
};
