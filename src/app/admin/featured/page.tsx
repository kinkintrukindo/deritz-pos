import Link from "next/link";
import { requireAdminSession, updateFeaturedProductsAction } from "@/app/admin/actions";
import { getSiteSettings } from "@/lib/settings";
import { getPublishedProducts } from "@/lib/products";
import { AdminNav } from "@/components/AdminNav";

export default async function FeaturedLooksPage() {
  await requireAdminSession();
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getPublishedProducts(),
  ]);

  const featuredIds = settings.featuredProductIds || [];

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Featured Looks</h1>
        </div>
      </div>

      <AdminNav active="featured" />

      <div className="max-w-2xl">

      <form action={updateFeaturedProductsAction} className="space-y-6 border border-mist p-6">
        <div>
          <p className="text-sm text-graphite mb-4">
            Select up to 4 products to display in the "Featured Looks" section on the homepage. Drag to reorder.
          </p>

          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto border border-mist p-4 bg-surface">
            {products.length === 0 ? (
              <p className="text-sm text-graphite italic">No products available</p>
            ) : (
              products.map((product, idx) => (
                <label key={product.id} className="flex items-start gap-3 p-2 hover:bg-paper rounded cursor-pointer">
                  <input
                    type="checkbox"
                    name="featuredProductIds"
                    value={product.id}
                    defaultChecked={featuredIds.includes(product.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink truncate">{product.name}</div>
                    <div className="text-xs text-graphite">₩{product.basePriceIdr.toLocaleString()}</div>
                  </div>
                </label>
              ))
            )}
          </div>

          <div className="bg-gold/10 border border-gold/20 p-3 rounded text-sm text-graphite">
            <strong>Current selection:</strong> {featuredIds.length} of 4 spots
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
        >
          Save Featured Looks
        </button>
      </form>
      </div>
    </div>
  );
}
