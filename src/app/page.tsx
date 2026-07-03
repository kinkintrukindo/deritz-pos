import Image from "next/image";
import Link from "next/link";
import { getPublishedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import { getAllCollections } from "@/lib/collections";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, settings, allCollections] = await Promise.all([
    getPublishedProducts(),
    getSiteSettings(),
    getAllCollections(),
  ]);
  const featured = products.slice(0, 4);
  const collections = allCollections;

  return (
    <div>
      <section className="relative h-[88vh] min-h-[540px] w-full overflow-hidden bg-ink">
        {settings.heroMediaType === "video" ? (
          <video
            src={settings.heroMediaUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={settings.heroMediaUrl}
            alt={settings.heroHeadline}
            fill
            priority
            className="object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 lg:px-10 pb-16 text-white">
          <p className="text-xs tracking-wide-label uppercase text-white/70 mb-3">
            {settings.heroEyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl font-medium leading-[1.05] max-w-2xl tracking-tight">
            {settings.heroHeadline}
          </h1>
          <Link
            href="/collection"
            className="inline-block mt-8 bg-white text-ink px-8 py-3 text-xs tracking-wide-label uppercase hover:bg-gold hover:text-white transition-colors"
          >
            {settings.heroButtonLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl font-medium text-ink tracking-tight">Featured Looks</h2>
          <Link
            href="/collection"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        <h2 className="text-2xl font-medium text-ink tracking-tight mb-10">Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collection?c=${encodeURIComponent(collection.id)}`}
              className="group relative overflow-hidden min-h-64 border border-mist hover:border-ink transition-colors flex flex-col justify-end"
            >
              {collection.image && (
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover absolute inset-0 group-hover:scale-105 transition-transform"
                />
              )}
              <div className="relative z-10 px-8 py-6 bg-gradient-to-t from-ink/90 to-transparent">
                <span className="text-lg font-medium text-white block">{collection.name}</span>
                {collection.caption && (
                  <span className="text-sm text-white/80">{collection.caption}</span>
                )}
                <span className="text-white group-hover:text-gold group-hover:translate-x-1 transition-all inline-block mt-3">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-20 text-center">
          <p className="text-xs tracking-wide-label uppercase text-gold mb-4">
            De Ritz Couture
          </p>
          <h2 className="text-2xl font-medium text-ink tracking-tight mb-6">
            Tailored to your story. Hand-finished for your perfect day.
          </h2>
          <p className="text-graphite leading-relaxed">
            Every De Ritz gown and set is individually hand-cut and finished to your exact dimensions, ensuring couture quality delivered straight to your door.
          </p>
        </div>
      </section>
    </div>
  );
}
