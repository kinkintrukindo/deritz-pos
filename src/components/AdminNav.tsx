import Link from "next/link";

const TABS = [
  { key: "catalogue", label: "Catalogue", href: "/admin/dashboard" },
  { key: "collections", label: "Collections", href: "/admin/collections" },
  { key: "orders", label: "Orders", href: "/admin/orders" },
  { key: "homepage", label: "Homepage", href: "/admin/homepage" },
] as const;

export function AdminNav({
  active,
}: {
  active: "catalogue" | "collections" | "orders" | "homepage";
}) {
  return (
    <div className="flex gap-6 border-b border-mist mb-10">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`pb-3 text-xs tracking-wide-label uppercase border-b-2 -mb-px transition-colors ${
            active === tab.key
              ? "border-ink text-ink"
              : "border-transparent text-graphite hover:text-ink"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
