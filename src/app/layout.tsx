import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { ToastProvider } from "@/components/Toast";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "De Ritz Atelier — Custom Bridal & Couture",
  description:
    "Tailored to your story. Hand-finished for your perfect day. Every De Ritz gown and set is individually hand-cut and finished to your exact dimensions, ensuring couture quality delivered straight to your door.",
  keywords: ["bridal wear", "kebaya", "couture", "custom tailored", "made to measure", "Indonesian design"],
  authors: [{ name: "De Ritz Atelier" }],
  openGraph: {
    title: "De Ritz Atelier",
    description: "Tailored to your story. Hand-finished for your perfect day.",
    type: "website",
    url: "https://deritz-pos.vercel.app",
  },
  icons: {
    icon: "/favicon-64.png",
    shortcut: "/favicon.ico",
    apple: "/favicon-64.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/*
          Loaded via a plain <link> instead of next/font/google.
          next/font/google fetches font files from Google's CDN during the
          Vercel BUILD itself — if that fetch 404s or times out (which has
          happened), the entire deployment fails. A runtime <link> loads in
          the visitor's browser instead, so it can never block a deploy.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ToastProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <WishlistProvider>
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                </WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
