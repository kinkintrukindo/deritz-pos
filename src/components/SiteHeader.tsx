import Link from "next/link";
import Image from "next/image";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { CartLink } from "@/components/CartLink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/brand/logo.png"
            alt="De Ritz"
            width={36}
            height={36}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-ink hidden sm:inline">
            De Ritz
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wide-label uppercase text-graphite">
          <Link href="/collection" className="hover:text-ink transition-colors">
            Collection
          </Link>
          <Link href="/collection#merona" className="hover:text-ink transition-colors">
            Merona
          </Link>
          <Link href="/appointments" className="hover:text-ink transition-colors">
            Book a Fitting
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CurrencySwitcher />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
