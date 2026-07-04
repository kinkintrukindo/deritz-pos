import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductBadges } from "@/components/ProductBadges";
import { ProductGallery } from "@/components/ProductGallery";
import { AskStylistButton } from "@/components/AskStylistButton";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <ProductGallery
        images={product.images}
        alt={product.name}
        badge={<ProductBadges product={product} />}
      />

      <div className="lg:pt-6">
        <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
          {product.collection}
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">{product.name}</h1>
        <p className="text-graphite leading-relaxed mb-6">{product.description}</p>

        {product.details.length > 0 && (
          <ul className="text-sm text-graphite space-y-1.5 mb-10 list-disc list-inside">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        <div className="mb-8 flex gap-3">
          <AskStylistButton product={product} />
          <ShareButton product={product} />
        </div>

        <AddToCartPanel product={product} />
      </div>
    </div>
  );
}
