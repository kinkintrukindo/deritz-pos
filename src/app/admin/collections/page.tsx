import { getAllCollections, getUsedCollections } from "@/lib/collections";
import { getAllProducts } from "@/lib/products";
import {
  requireAdminSession,
  addCollectionAction,
  updateCollectionAction,
  logout,
} from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { CollectionDeleteButton } from "@/components/CollectionDeleteButton";

export default async function AdminCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdminSession();
  const { saved, error } = await searchParams;
  const collections = await getAllCollections();
  const products = await getAllProducts();
  const { orphaned } = await getUsedCollections(products);

  const collectionProductCounts = collections.map((c) => ({
    ...c,
    count: products.filter((p) => p.collection === c.id).length,
  }));

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Collections</h1>
        </div>
        <form action={logout}>
          <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
            Log out
          </button>
        </form>
      </div>

      <AdminNav active="collections" />

      {saved && <p className="text-xs text-gold mb-4">Collection updated.</p>}
      {error === "empty-name" && (
        <p className="text-xs text-red-600 mb-4">Collection name cannot be empty.</p>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-medium text-ink mb-4">Add Collection</h2>
          <form action={addCollectionAction} className="space-y-3 border border-mist p-4">
            <label className="block">
              <span className="text-xs tracking-wide-label uppercase text-graphite">
                Collection Name
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Spring 2026"
                className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide-label uppercase text-graphite">
                Collection Caption (optional)
              </span>
              <input
                type="text"
                name="caption"
                placeholder="e.g. A celebration of spring's renewal"
                className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-wide-label uppercase text-graphite">
                Collection Image (optional)
              </span>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-2.5 hover:bg-gold transition-colors"
            >
              Add Collection
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink mb-4">Manage Collections</h2>
          {collectionProductCounts.length === 0 ? (
            <p className="text-graphite text-sm">No collections yet. Create one above.</p>
          ) : (
            <div className="space-y-3 border border-mist divide-y divide-mist">
              {collectionProductCounts.map((collection) => (
                <div key={collection.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{collection.name}</p>
                      {collection.caption && (
                        <p className="text-xs text-graphite mt-1">{collection.caption}</p>
                      )}
                      <p className="text-xs text-graphite mt-0.5">
                        {collection.count} product{collection.count === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <CollectionDeleteButton
                        collectionId={collection.id}
                        collectionName={collection.name}
                      />
                    </div>
                  </div>
                  <form action={updateCollectionAction.bind(null, collection.id)} className="space-y-2 pt-2 border-t border-mist">
                    <label className="block">
                      <span className="text-xs tracking-wide-label uppercase text-graphite">
                        Collection Name
                      </span>
                      <input
                        type="text"
                        name="name"
                        defaultValue={collection.name}
                        className="mt-1 w-full border border-mist px-2 py-1.5 text-xs bg-paper focus:outline-none focus:border-ink"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs tracking-wide-label uppercase text-graphite">
                        Caption
                      </span>
                      <input
                        type="text"
                        name="caption"
                        defaultValue={collection.caption ?? ""}
                        placeholder="Optional caption for display"
                        className="mt-1 w-full border border-mist px-2 py-1.5 text-xs bg-paper focus:outline-none focus:border-ink"
                      />
                    </label>
                    {collection.image && (
                      <div className="flex items-center gap-2">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-12 h-16 object-cover border border-mist"
                        />
                        <span className="text-xs text-graphite">Current image</span>
                      </div>
                    )}
                    <label className="block">
                      <span className="text-xs tracking-wide-label uppercase text-graphite">
                        Collection Image (optional)
                      </span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="mt-1 w-full border border-mist px-2 py-1.5 text-xs bg-paper focus:outline-none focus:border-ink"
                      />
                    </label>
                    <button
                      type="submit"
                      className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {orphaned.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-ink mb-4">Unmanaged Collections</h2>
            <p className="text-xs text-graphite mb-3">
              These collections exist in products but are no longer in the managed list. Products
              will continue using them, but they won't appear as filter pills.
            </p>
            <div className="space-y-1 text-sm text-graphite">
              {orphaned.map((name) => (
                <p key={name}>• {name}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
