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
            <li>
              <a
                href="https://maps.google.com/?q=Jalan+Villa+Bukit+Mas+F2,+Villa+Jepang,+Dukuh+Pakis,+Surabaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                Jalan Villa Bukit Mas F2<br />
                Villa Jepang, Dukuh Pakis<br />
                Kec. Dukuhpakis, Surabaya<br />
                Jawa Timur 60225
              </a>
            </li>
            <li>
              <a
                href="tel:+6281335838367"
                className="hover:text-ink transition-colors"
              >
                +62 813-3583-8367
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/deritz/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                title="Follow on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
                </svg>
                <span>@deritz</span>
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
      <div className="border-t border-mist py-6 px-6 lg:px-10 text-xs text-graphite/80" style={{ fontFamily: 'var(--font-trajan)' }}>
        © {new Date().getFullYear()} De Ritz
      </div>
    </footer>
  );
}
