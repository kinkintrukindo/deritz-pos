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
                href="tel:+6281335838367"
                className="inline-flex items-center gap-2 hover:text-ink transition-colors"
                title="Call us"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.6915026,16.4744748 C22.2157487,15.8644215 21.089999,15.0152625 19.8313008,15.0152625 C18.5725944,15.0152625 17.1189594,15.4230889 16.0151496,16.5368506 C15.3904808,17.1686939 14.6393994,17.4628707 13.8199641,17.4628707 C13.0005288,17.4628707 12.2494472,17.1686939 11.6247784,16.5368506 C10.0574926,14.9369857 7.34215116,12.1840075 7.34215116,8.15472926 C7.34215116,5.53871021 9.40605021,3.47652174 12.0158834,3.47652174 C12.8353187,3.47652174 13.5864003,3.77069848 14.2110691,4.40254181 C14.8357379,5.03438514 15.5868195,5.32856188 16.4062548,5.32856188 C17.225688,5.32856188 17.9767696,5.03438514 18.6014384,4.40254181 C19.9601365,3.04360091 21.4137715,2.63578451 22.6724848,2.63578451 C24.0931627,2.63578451 25.2588516,3.47652174 25.2588516,5.1006803 C25.2588516,6.72484886 24.0931627,8.34891742 22.6915026,9.75217535 C21.6114075,10.8659371 20.1577725,11.2737635 18.8590494,11.2737635 C17.5603264,11.2737635 16.2615879,10.8659371 15.1816031,9.75217535 C14.5569343,9.12033202 13.8058526,8.82615528 12.9864173,8.82615528 C12.166982,8.82615528 11.4159004,9.12033202 10.7912316,9.75217535 C9.22394583,11.3520402 9.22394583,14.104419 10.7912316,15.7042835 C11.4159004,16.3361268 12.166982,16.6303036 12.9864173,16.6303036 C13.8058526,16.6303036 14.5569343,16.3361268 15.1816031,15.7042835 C16.2615879,14.5905218 17.5603264,14.1826955 18.8590494,14.1826955 C20.1577725,14.1826955 21.6114075,14.5905218 22.6915026,15.7042835 C23.3161714,16.3361268 24.067253,16.6303036 24.8866883,16.6303036 L24.8866883,17.4628707 C24.067253,17.4628707 23.3161714,17.7570475 22.6915026,18.3888909 C20.933098,20.1699839 18.6014384,21.2663188 16.0062548,21.2663188 C13.4110712,21.2663188 11.0794116,20.1699839 9.32100705,18.3888909 C6.8132888,15.8644215 6.8132888,11.3520402 9.32100705,8.82615528 C11.0794116,7.04506235 13.4110712,5.94872745 16.0062548,5.94872745 C18.6014384,5.94872745 20.933098,7.04506235 22.6915026,8.82615528 C23.9502007,10.1045963 24.7696361,11.3520402 25.2588516,12.3216121 L24.4394162,12.8433844 C23.9502007,11.9230854 23.0461476,10.7445574 22.0119451,9.71040892 Z"/>
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
