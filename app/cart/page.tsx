"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { resolveCartItem } from "@/lib/cart-pricing";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = items
    .map((item, index) => {
      const resolved = resolveCartItem(item);
      return resolved ? { ...resolved, index } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const total = rows.reduce((sum, r) => sum + r.price, 0);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (rows.length === 0) {
    return (
      <section className={styles.empty}>
        <span className={styles.eyebrow}>Cart</span>
        <h1>Nothing here yet.</h1>
        <p>
          <Link href="/works" className={styles.link}>
            Browse the works
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className={styles.cart}>
      <span className={styles.eyebrow}>Cart</span>
      <h1>
        {rows.length} {rows.length === 1 ? "piece" : "pieces"}
      </h1>

      <div className={styles.list}>
        {rows.map((row) => (
          <div className={styles.row} key={`${row.id}-${row.index}`}>
            <div className={styles.thumb}>
              <Image
                src={row.image}
                alt={row.title}
                fill
                sizes="120px"
                className={styles.thumbImg}
              />
            </div>
            <div className={styles.rowInfo}>
              <Link href={row.href} className={styles.rowTitle}>
                {row.title}
              </Link>
              <div className={styles.rowMeta}>{row.meta}</div>
            </div>
            <div className={styles.rowPrice}>
              <span className={styles.cur}>EUR</span>
              {row.price}
            </div>
            <button
              className={styles.remove}
              onClick={() => removeItem(row.index)}
              aria-label={`Remove ${row.title} from cart`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span>Total</span>
        <span className={styles.total}>
          <span className={styles.cur}>EUR</span>
          {total}
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.checkout}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Redirecting…" : "Checkout"}
      </button>
    </section>
  );
}
