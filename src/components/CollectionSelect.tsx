import type { Collection } from "@/lib/collections";

export function CollectionSelect({
  collections,
  defaultValue,
}: {
  collections: Collection[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide-label uppercase text-graphite">
        Collection
      </span>
      <select
        name="collection"
        required
        defaultValue={defaultValue || ""}
        className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
      >
        <option value="">Select a collection...</option>
        {collections.map((col) => (
          <option key={col.id} value={col.id}>
            {col.name}
          </option>
        ))}
      </select>
    </label>
  );
}
