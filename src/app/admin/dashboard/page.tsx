import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import {
  requireAdminSession,
  createProductAction,
  togglePublishedAction,
  toggleSoldOutAction,
  deleteProductAction,
  logout,
} from "@/app/admin/actions";
import { ImageGalleryEditor } from "@/components/ImageGalleryEditor";
import { AdminField } from "@/components/AdminField";
import { AdminNav } from "@/components/AdminNav";
import { CollectionSelect } from "@/components/CollectionSelect";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const products = await getAllProducts();
  const collections = await getAllCollections();

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Catalogue</h1>
        </div>
        <form action={logout}>
          <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
            Log out
          </button>
        </form>
      </div>

      <AdminNav active="catalogue" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12">
        <section>
          <h2 className="text-xl font-medium tracking-tight text-ink mb-4">
            Pieces ({products.length})
          </h2>
          <div className="border border-mist divide-y divide-mist">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-ink">
                    {product.name}
                    {product.isNew && (
                      <span className="ml-2 text-[10px] tracking-wide-label uppercase text-gold">
                        New
                      </span>
                    )}
                    {product.isPromo && (
                      <span className="ml-2 text-[10px] tracking-wide-label uppercase text-ink/70">
                        Promo
                      </span>
                    )}
                    {product.soldOut && (
                      <span className="ml-2 text-[10px] tracking-wide-label uppercase text-red-700">
                        Sold Out
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-graphite">
                    {product.collection} · Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(product.basePriceIdr)} ·{" "}
                    {product.published ? "Published" : "Hidden"}
                  </p>
                </div>
                <Link
                  href={`/admin/edit/${product.id}`}
                  className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline"
                >
                  Edit
                </Link>
                <form action={togglePublishedAction.bind(null, product.id, !product.published)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
                    {product.published ? "Hide" : "Publish"}
                  </button>
                </form>
                <form action={toggleSoldOutAction.bind(null, product.id, !product.soldOut)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-red-700 underline">
                    {product.soldOut ? "Mark In Stock" : "Mark Sold Out"}
                  </button>
                </form>
                <form action={deleteProductAction.bind(null, product.id)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-red-600 underline">
                    Delete
                  </button>
                </form>
              </div>
            ))}
            {products.length === 0 && (
              <p className="p-4 text-sm text-graphite">No pieces yet.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Add a Piece</h2>
          <form action={createProductAction} className="space-y-4 border border-mist p-6">
            <AdminField label="Name" name="name" required />
            <CollectionSelect collections={collections} />
            <AdminField label="Description" name="description" textarea />
            <AdminField label="Base Price (IDR)" name="basePriceIdr" type="number" required />

            <ImageGalleryEditor />

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-sm text-graphite">
                <input type="checkbox" name="isNew" />
                Highlight as New Collection
              </label>
              <label className="flex items-center gap-2 text-sm text-graphite">
                <input type="checkbox" name="isPromo" />
                Discount Promo
              </label>
              <p className="text-xs text-graphite pl-6">
                Either tag moves the piece to the top of listings and shows a banner on its card.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-graphite">
              <input type="checkbox" name="published" defaultChecked />
              Publish immediately
            </label>
            <button
              type="submit"
              className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
            >
              Save Piece
            </button>
            <p className="text-xs text-graphite">
              New pieces use standard XS/S/M presets and default measurement
              ranges — per-piece size charts are a fast-follow.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
