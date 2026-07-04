import { getPublishedProducts } from "@/lib/products";
import { getAllCollections, getUsedCollections } from "@/lib/collections";
import { ProductCollectionGrid } from "@/components/ProductCollectionGrid";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const products = await getPublishedProducts();
  const { managed: collections, orphaned } = await getUsedCollections(products);
  const filtered = c ? products.filter((p) => p.collection === c) : products;

  const collectionName = c
    ? collections.find((col) => col.id === c)?.name ?? (orphaned.includes(c) ? c : undefined) ?? "All Pieces"
    : "All Pieces";

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <div className="mb-12">
        <p className="text-xs tracking-wide-label uppercase text-graphite mb-3">
          The Collection
        </p>
        <h1 className="text-4xl font-medium text-ink tracking-tight">
          {collectionName}
        </h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        <FilterPill href="/collection" label="All" active={!c} />
        {collections.map((collection) => (
          <FilterPill
            key={collection.id}
            href={`/collection?c=${encodeURIComponent(collection.id)}`}
            label={collection.name}
            active={c === collection.id}
          />
        ))}
        {orphaned.map((collectionName) => (
          <FilterPill
            key={collectionName}
            href={`/collection?c=${encodeURIComponent(collectionName)}`}
            label={collectionName}
            active={c === collectionName}
            orphaned
          />
        ))}
      </div>

      <ProductCollectionGrid products={filtered} />
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
  orphaned,
}: {
  href: string;
  label: string;
  active: boolean;
  orphaned?: boolean;
}) {
  return (
    <a
      href={href}
      className={`font-trajan text-xs tracking-wide-label uppercase px-4 py-2 border transition-colors ${
        active
          ? "bg-ink text-white border-ink"
          : orphaned
            ? "border-mist text-graphite/50 hover:border-graphite/50 hover:text-graphite/60 bg-surface/50"
            : "border-mist text-graphite hover:border-ink hover:text-ink"
      }`}
      title={orphaned ? "This collection is no longer managed" : undefined}
    >
      {label}
    </a>
  );
}
