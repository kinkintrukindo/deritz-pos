import type { Product } from "@/lib/types";
import { SUPABASE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/store";

export type Collection = {
  id: string;
  name: string;
  caption?: string;
  image?: string;
  order: number;
};

export async function getAllCollections(): Promise<Collection[]> {
  const collections = await readJson<Collection[]>(SUPABASE_KEYS.COLLECTIONS, []);
  return [...collections].sort((a, b) => a.order - b.order);
}

export async function addCollection(name: string, caption?: string, image?: string): Promise<Collection> {
  const collections = await readJson<Collection[]>(SUPABASE_KEYS.COLLECTIONS, []);
  const maxOrder = collections.length > 0 ? Math.max(...collections.map((c) => c.order)) : 0;
  const newCollection: Collection = {
    id: name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    caption,
    image,
    order: maxOrder + 1,
  };
  collections.push(newCollection);
  await writeJson(SUPABASE_KEYS.COLLECTIONS, collections);
  return newCollection;
}

export async function updateCollection(id: string, name: string, caption?: string, image?: string): Promise<void> {
  const collections = await readJson<Collection[]>(SUPABASE_KEYS.COLLECTIONS, []);
  const updated = collections.map((c) => (c.id === id ? { ...c, name, caption: caption || c.caption, image: image || c.image } : c));
  await writeJson(SUPABASE_KEYS.COLLECTIONS, updated);
}

export async function deleteCollection(id: string): Promise<void> {
  const collections = await readJson<Collection[]>(SUPABASE_KEYS.COLLECTIONS, []);
  await writeJson(
    SUPABASE_KEYS.COLLECTIONS,
    collections.filter((c) => c.id !== id)
  );
}

export async function reorderCollections(ids: string[]): Promise<void> {
  const collections = await readJson<Collection[]>(SUPABASE_KEYS.COLLECTIONS, []);
  const updated = collections.map((c) => ({
    ...c,
    order: ids.indexOf(c.id),
  }));
  await writeJson(SUPABASE_KEYS.COLLECTIONS, updated);
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
