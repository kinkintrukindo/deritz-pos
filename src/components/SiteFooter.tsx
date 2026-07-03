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
                  <path d="M20.52 3.48C18.36 1.32 15.41 0 12.21 0 5.97 0 1.03 4.94 1.03 11.18c0 1.96.51 3.88 1.48 5.56L1 24l5.71-1.49c1.62.88 3.45 1.34 5.34 1.34 6.24 0 11.18-4.94 11.18-11.18 0-2.99-1.2-5.79-3.38-7.88zM12.21 21.45c-1.67 0-3.28-.43-4.71-1.24l-.34-.2-3.5.91.92-3.38-.22-.35C2.5 14.75 2.1 13.01 2.1 11.18c0-5.17 4.21-9.38 9.38-9.38 2.5 0 4.85.97 6.62 2.75 1.77 1.77 2.75 4.12 2.75 6.62 0 5.17-4.21 9.38-9.38 9.38zm5.1-7.02c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.63.14-.18.28-.73.91-.89 1.1-.16.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.41-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.04-.35-.02-.49-.06-.14-.63-1.51-.86-2.07-.23-.54-.46-.47-.63-.48-.16-.01-.35-.01-.54-.01-.19 0-.49.07-.74.35-.25.28-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.82.14.19 1.98 3.02 4.8 4.23.67.29 1.2.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.66-.68 1.89-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.55-.33z"/>
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
