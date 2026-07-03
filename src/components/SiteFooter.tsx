import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-mist mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Image
            src="/brand/logo.png"
            alt="De Ritz — Make Up & Bridal"
            width={160}
            height={160}
            className="h-14 w-auto object-contain mb-4"
          />
          <p className="text-sm text-graphite leading-relaxed max-w-xs">
            Be a Glamorous and Sexy Bride
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-4">
            Shop
          </p>
          <ul className="space-y-2 text-sm text-graphite">
            <li>
              <Link href="/collection" className="hover:text-ink transition-colors">
                Full Collection
              </Link>
            </li>
            <li>
              <Link href="/appointments" className="hover:text-ink transition-colors">
                Book a Fitting
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-ink transition-colors">
                Your Bag
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-4">
            Visit
          </p>
          <ul className="space-y-2 text-sm text-graphite">
            <li>Villa Bukitmas F2, Surabaya</li>
            <li>
              <a
                href="https://wa.me/6281335838367"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                +62 813-3583-8367 (WhatsApp)
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/deritz/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-4">
            Atelier
          </p>
          <ul className="space-y-2 text-sm text-graphite">
            <li>
              <Link href="/admin" className="hover:text-ink transition-colors">
                Staff Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist py-6 text-center text-xs text-graphite/80">
        © {new Date().getFullYear()} De Ritz Make Up &amp; Bridal. All rights reserved.
      </div>
    </footer>
  );
}
