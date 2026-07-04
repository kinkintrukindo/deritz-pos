import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { getProductLabels } from "@/lib/labels";
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
import { ProductLabelSelector } from "@/components/ProductLabelSelector";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const products = await getAllProducts();
  const collections = await getAllCollections();
  const labels = await getProductLabels();

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
              <div key={product.id} className="p-3 sm:p-4 grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 sm:items-start">
                <div className="relative w-14 h-18 sm:w-16 sm:h-20 flex-shrink-0 row-span-2 sm:row-span-1">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-ink">
                    {product.name}
                    {labels
                      .filter((l) => product.labelIds?.includes(l.id))
                      .map((label) => (
                        <span
                          key={label.id}
                          className="ml-2 text-[8px] sm:text-[10px] tracking-wide-label uppercase px-1.5 py-0.5 text-white"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    {product.soldOut && (
                      <span className="ml-2 text-[8px] sm:text-[10px] tracking-wide-label uppercase text-red-700">
                        Sold Out
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-graphite mt-1">
                    {product.collection} · Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(product.basePriceIdr)} ·{" "}
                    {product.published ? "Published" : "Hidden"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link
                    href={`/admin/edit/${product.id}`}
                    className="text-[10px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline whitespace-nowrap"
                  >
                    Edit
                  </Link>
                  <form action={togglePublishedAction.bind(null, product.id, !product.published)}>
                    <button className="text-[10px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline whitespace-nowrap">
                      {product.published ? "Hide" : "Pub"}
                    </button>
                  </form>
                  <form action={toggleSoldOutAction.bind(null, product.id, !product.soldOut)}>
                    <button className="text-[10px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-red-700 underline whitespace-nowrap">
                      {product.soldOut ? "Stock" : "Sold"}
                    </button>
                  </form>
                  <form action={deleteProductAction.bind(null, product.id)}>
                    <button className="text-[10px] sm:text-xs tracking-wide-label uppercase text-graphite hover:text-red-600 underline whitespace-nowrap">
                      Del
                    </button>
                  </form>
                </div>
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
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-graphite">
                <input type="checkbox" name="enableDiscount" />
                Enable Price Discount
              </label>
              <AdminField
                label="Discount (%)"
                name="discountPercent"
                type="number"
                placeholder="0"
              />
            </div>
            <AdminField label="Lead Time (days)" name="leadTimeDays" type="number" defaultValue="21" />

            <ImageGalleryEditor />

            <ProductLabelSelector />

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
