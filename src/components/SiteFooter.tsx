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
                className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.929 1.316c-.06.037-.124.083-.189.129-1.396.844-2.607 2.071-3.443 3.426C2.432 9.149 2 10.814 2 12.5c0 1.074.141 2.12.412 3.133.793 2.923 2.613 5.542 5.226 7.108 1.348.778 2.81 1.378 4.368 1.665 1.306.24 2.651.36 4 .36 1.347 0 2.692-.12 3.998-.36 1.558-.287 3.02-.887 4.368-1.665 2.613-1.566 4.433-4.185 5.226-7.108.27-.996.412-2.059.412-3.133 0-1.686-.432-3.351-1.264-4.821-.835-1.355-2.046-2.582-3.443-3.426-.065-.046-.129-.092-.189-.129-1.53-.921-3.3-1.432-5.148-1.515-.265-.012-.531-.018-.797-.018z"/>
                </svg>
                <span>+62 813-3583-8367</span>
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
      <div className="border-t border-mist py-6 text-center text-xs text-graphite/80">
        © {new Date().getFullYear()} De Ritz Make Up &amp; Bridal. All rights reserved.
      </div>
    </footer>
  );
}
