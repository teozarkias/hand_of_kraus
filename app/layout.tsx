import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import HeaderCart from "@/components/HeaderCart";
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
            <a href="/" className={styles.logo}>
              Kraus
            </a>
            <nav className={styles.nav}>
              <a href="/">Home</a>
              <a href="/works">Works</a>
              <a href="/shop">Shop</a>
            </nav>
            <HeaderCart />
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
