import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { ToastProvider } from "@/components/Toast";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "De Ritz — Make Up & Bridal",
  description:
    "Designer Peranakan kebaya and bridal wear, made to measure. De Ritz — Make Up & Bridal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
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
