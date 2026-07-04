import Link from "next/link";

const TABS = [
  { key: "catalogue", label: "Catalogue", href: "/admin/dashboard" },
  { key: "collections", label: "Collections", href: "/admin/collections" },
  { key: "featured", label: "Featured Looks", href: "/admin/featured" },
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "homepage", label: "Homepage", href: "/admin/homepage" },
] as const;

export function AdminNav({
  active,
}: {
  active: "catalogue" | "collections" | "featured" | "orders" | "homepage";
}) {
  return (
    <div className="overflow-x-auto border-b border-mist mb-10">
      <div className="flex gap-4 sm:gap-6 min-w-min">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`pb-3 text-[11px] sm:text-xs tracking-wide-label uppercase border-b-2 -mb-px transition-colors whitespace-nowrap ${
              active === tab.key
                ? "border-ink text-ink"
                : "border-transparent text-graphite hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
