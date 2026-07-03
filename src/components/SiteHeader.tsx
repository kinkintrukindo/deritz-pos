'use client';

import Link from "next/link";
import Image from "next/image";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { CartLink } from "@/components/CartLink";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  async function handleLogout() {
    await signOut();
    setShowMenu(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/brand/logo.png"
            alt="De Ritz"
            width={36}
            height={36}
            className="h-7 w-7 object-contain"
            priority
          />
          <span style={{ fontFamily: 'var(--font-trajan)' }}>
            <div className="text-[11px] sm:text-xs tracking-wider text-ink leading-none">De Ritz</div>
            <div className="text-[8px] sm:text-[10px] tracking-widest text-graphite italic leading-none">L&apos;Atelier</div>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wide-label uppercase text-graphite">
          <Link href="/collection" className="hover:text-ink transition-colors">
            Collection
          </Link>
          <Link href="/appointments" className="hover:text-ink transition-colors">
            Book a Fitting
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CurrencySwitcher />
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink transition-colors"
              >
                {user.email?.split('@')[0]}
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-mist shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-xs tracking-wide-label uppercase text-graphite hover:bg-surface hover:text-ink transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
          <CartLink />
        </div>
      </div>
    </header>
  );
}
