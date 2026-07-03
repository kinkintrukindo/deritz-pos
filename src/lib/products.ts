import type { Product, ProductImage } from "@/lib/types";
import { readJson, writeJson } from "@/lib/store";
import { uploadMedia } from "@/lib/media";

const STORE_KEY = "products";

function normalizeCollectionName(collection: string): string {
  return collection
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function readAll(): Promise<Product[]> {
  const products = await readJson<Product[]>(STORE_KEY, []);
  return products.map((p) => ({
    ...p,
    collection: normalizeCollectionName(p.collection),
  }));
}

async function writeAll(products: Product[]): Promise<void> {
  await writeJson(STORE_KEY, products);
}

function sortFeaturedFirst(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aFeatured = a.isNew || a.isPromo ? 1 : 0;
    const bFeatured = b.isNew || b.isPromo ? 1 : 0;
    return bFeatured - aFeatured;
  });
}

export async function getPublishedProducts(): Promise<Product[]> {
  const products = await readAll();
  return sortFeaturedFirst(products.filter((p) => p.published));
}

export async function getAllProducts(): Promise<Product[]> {
  return sortFeaturedFirst(await readAll());
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readAll();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readAll();
  return products.find((p) => p.id === id);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProductImage(file: File): Promise<string> {
  return uploadMedia(file, "products");
}

const PLACEHOLDER_IMAGE: ProductImage = { url: "/products/placeholder.jpg", caption: "" };

function normalizeImages(images: ProductImage[]): ProductImage[] {
  return images.length > 0 ? images : [PLACEHOLDER_IMAGE];
}

export type NewProductInput = {
  name: string;
  collection: string;
  description: string;
  basePriceIdr: number;
  leadTimeDays?: number;
  images: ProductImage[];
  published: boolean;
  isNew: boolean;
  isPromo: boolean;
};

const DEFAULT_MADE_TO_MEASURE_SURCHARGE_IDR = 0;
const DEFAULT_LEAD_TIME_DAYS = 21;

const DEFAULT_SIZE_PRESETS = {
  XS: { bust: 80, waist: 62, hip: 86 },
  S: { bust: 84, waist: 66, hip: 90 },
  M: { bust: 88, waist: 70, hip: 94 },
  L: { bust: 92, waist: 77, hip: 102 },
};

const DEFAULT_MEASUREMENT_RANGES = {
  bust: { min: 74, max: 106 },
  waist: { min: 56, max: 92 },
  hip: { min: 80, max: 114 },
};

export async function addProduct(input: NewProductInput): Promise<Product> {
  const products = await readAll();
  const baseSlug = slugify(input.name) || `piece-${Date.now()}`;
  let slug = baseSlug;
  let n = 2;
  while (products.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  const images = normalizeImages(input.images);

  const product: Product = {
    id: slug,
    slug,
    name: input.name,
    collection: input.collection,
    description: input.description,
    details: [],
    image: images[0].url,
    images,
    basePriceIdr: input.basePriceIdr,
    madeToMeasureSurchargeIdr: DEFAULT_MADE_TO_MEASURE_SURCHARGE_IDR,
    leadTimeDays: DEFAULT_LEAD_TIME_DAYS,
    sizePresets: DEFAULT_SIZE_PRESETS,
    measurementRanges: DEFAULT_MEASUREMENT_RANGES,
    published: input.published,
    isNew: input.isNew,
    isPromo: input.isPromo,
    soldOut: false,
  };

  products.push(product);
  await writeAll(products);
  return product;
}

export type UpdateProductInput = {
  name: string;
  collection: string;
  description: string;
  basePriceIdr: number;
  leadTimeDays?: number;
  images: ProductImage[];
  published: boolean;
  isNew: boolean;
  isPromo: boolean;
  soldOut: boolean;
};

export async function updateProduct(id: string, input: UpdateProductInput): Promise<void> {
  const products = await readAll();
  const images = normalizeImages(input.images);
  const next = products.map((p) =>
    p.id === id
      ? {
          ...p,
          name: input.name,
          collection: input.collection,
          description: input.description,
          basePriceIdr: input.basePriceIdr,
          image: images[0].url,
          images,
          published: input.published,
          isNew: input.isNew,
          isPromo: input.isPromo,
          soldOut: input.soldOut,
        }
      : p
  );
  await writeAll(next);
}

export async function setProductPublished(id: string, published: boolean): Promise<void> {
  const products = await readAll();
  const next = products.map((p) => (p.id === id ? { ...p, published } : p));
  await writeAll(next);
}

export async function setProductSoldOut(id: string, soldOut: boolean): Promise<void> {
  const products = await readAll();
  const next = products.map((p) => (p.id === id ? { ...p, soldOut } : p));
  await writeAll(next);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await readAll();
  await writeAll(products.filter((p) => p.id !== id));
}
