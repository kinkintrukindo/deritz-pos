import { requireAdminSession } from "@/app/admin/actions";
import { getSiteSettings } from "@/lib/settings";
import { getPublishedProducts } from "@/lib/products";
import { AdminNav } from "@/components/AdminNav";
import FeaturedLooksClient from "./client";

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

      <div className="max-w-full">
        <FeaturedLooksClient products={products} initialFeaturedIds={featuredIds} />
      </div>
    </div>
  );
}
