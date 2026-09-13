import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Jost } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import HeaderCart from "@/components/HeaderCart";
import MobileNav from "@/components/MobileNav";
import styles from "./layout.module.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Kraus — Original Ink Works",
  description:
    "Original ink drawings — cliffs, tides, and things half-seen in the grain of the paper.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${jost.variable}`}>
        <CartProvider>
          <header className={styles.header}>
            {/* next/link instead of raw <a>: a raw anchor forces a full
                browser reload of the whole app on every menu click (the
                3-4s lag); Link does an instant in-app transition and
                prefetches the target page while the link is on screen. */}
            <Link href="/" className={styles.logo}>
              Kraus
            </Link>
            <nav className={styles.nav}>
              <Link href="/">Home</Link>
              <Link href="/works">Works</Link>
              <Link href="/shop">Shop</Link>
            </nav>
            <div className={styles.right}>
              <MobileNav />
              <HeaderCart />
            </div>
          </header>
          <main>{children}</main>
          <footer className={styles.footer}>
            <span>© Hand Of Kraus</span>
            <span>Athens, Greece</span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
