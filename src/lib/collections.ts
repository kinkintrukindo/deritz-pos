import type { Product } from "@/lib/types";
import { readJson, writeJson } from "@/lib/store";

export type Collection = {
  id: string;
  name: string;
  order: number;
};

const STORE_KEY = "collections";

export async function getAllCollections(): Promise<Collection[]> {
  const collections = await readJson<Collection[]>(STORE_KEY, []);
  return [...collections].sort((a, b) => a.order - b.order);
}

export async function addCollection(name: string): Promise<Collection> {
  const collections = await readJson<Collection[]>(STORE_KEY, []);
  const maxOrder = collections.length > 0 ? Math.max(...collections.map((c) => c.order)) : 0;
  const newCollection: Collection = {
    id: name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    order: maxOrder + 1,
  };
  collections.push(newCollection);
  await writeJson(STORE_KEY, collections);
  return newCollection;
}

export async function updateCollection(id: string, name: string): Promise<void> {
  const collections = await readJson<Collection[]>(STORE_KEY, []);
  const updated = collections.map((c) => (c.id === id ? { ...c, name } : c));
  await writeJson(STORE_KEY, updated);
}

export async function deleteCollection(id: string): Promise<void> {
  const collections = await readJson<Collection[]>(STORE_KEY, []);
  await writeJson(
    STORE_KEY,
    collections.filter((c) => c.id !== id)
  );
}

export async function reorderCollections(ids: string[]): Promise<void> {
  const collections = await readJson<Collection[]>(STORE_KEY, []);
  const updated = collections.map((c) => ({
    ...c,
    order: ids.indexOf(c.id),
  }));
  await writeJson(STORE_KEY, updated);
}

/**
 * Get all unique collections from products that exist as managed collections,
 * plus any products using collections that no longer exist (orphaned).
 */
export async function getUsedCollections(products: Product[]): Promise<{
  managed: Collection[];
  orphaned: string[];
}> {
  const allCollections = await getAllCollections();
  const managedIds = new Set(allCollections.map((c) => c.id));
  const usedInProducts = new Set(products.map((p) => p.collection));

  const orphaned = Array.from(usedInProducts).filter((c) => !managedIds.has(c));

  return {
    managed: allCollections,
    orphaned: orphaned.sort(),
  };
}
