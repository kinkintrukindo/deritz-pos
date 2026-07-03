import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { requireAdminSession, updateProductAction } from "@/app/admin/actions";
import { ImageGalleryEditor } from "@/components/ImageGalleryEditor";
import { AdminField } from "@/components/AdminField";
import { CollectionSelect } from "@/components/CollectionSelect";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const collections = await getAllCollections();

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 py-14">
      <Link
        href="/admin/dashboard"
        className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline"
      >
        &larr; Back to Catalogue
      </Link>

      <p className="text-xs tracking-wide-label uppercase text-graphite mt-6 mb-2">
        Edit Piece
      </p>
      <h1 className="text-3xl font-medium tracking-tight text-ink mb-8">{product.name}</h1>

      <form
        action={updateProductAction.bind(null, product.id)}
        className="space-y-4 border border-mist p-6"
      >
        <AdminField label="Name" name="name" required defaultValue={product.name} />
        <CollectionSelect collections={collections} defaultValue={product.collection} />
        <AdminField
          label="Description"
          name="description"
          textarea
          defaultValue={product.description}
        />
        <AdminField
          label="Base Price (IDR)"
          name="basePriceIdr"
          type="number"
          required
          defaultValue={product.basePriceIdr}
        />
        <AdminField
          label="Lead Time (days)"
          name="leadTimeDays"
          type="number"
          defaultValue={product.leadTimeDays}
        />

        <AdminField
          label="Weight (kg) - for shipping calculation only"
          name="weightKg"
          type="number"
          step="0.1"
          placeholder="5"
          defaultValue={product.weightKg ?? 5}
        />

        <div className="space-y-2">
          <label className="block text-xs tracking-wide-label uppercase text-graphite">
            Dimensions (cm) - for shipping calculation only
          </label>
          <div className="grid grid-cols-3 gap-2">
            <AdminField
              label="Width"
              name="dimensionsCm.width"
              type="number"
              placeholder="20"
              defaultValue={product.dimensionsCm?.width ?? 20}
            />
            <AdminField
              label="Height"
              name="dimensionsCm.height"
              type="number"
              placeholder="20"
              defaultValue={product.dimensionsCm?.height ?? 20}
            />
            <AdminField
              label="Depth"
              name="dimensionsCm.depth"
              type="number"
              placeholder="5"
              defaultValue={product.dimensionsCm?.depth ?? 5}
            />
          </div>
        </div>

        <ImageGalleryEditor initial={product.images} />

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input type="checkbox" name="isNew" defaultChecked={product.isNew} />
            Highlight as New Collection
          </label>
          <label className="flex items-center gap-2 text-sm text-graphite">
            <input type="checkbox" name="isPromo" defaultChecked={product.isPromo} />
            Discount Promo
          </label>
          <p className="text-xs text-graphite pl-6">
            Either tag moves the piece to the top of listings and shows a banner on its card.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" name="soldOut" defaultChecked={product.soldOut} />
          Sold Out (disables Add to Bag on the storefront)
        </label>

        <label className="flex items-center gap-2 text-sm text-graphite">
          <input type="checkbox" name="published" defaultChecked={product.published} />
          Published
        </label>

        <button
          type="submit"
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
