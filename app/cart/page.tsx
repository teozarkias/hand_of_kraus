"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { getPaintingById } from "@/lib/paintings";
import { getPrintSize } from "@/lib/pricing";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, removeItem } = useCart();

  const rows = items
    .map((item, index) => {
      const painting = getPaintingById(item.paintingId);
      if (!painting) return null;
      const price =
        item.kind === "original"
          ? painting.price
          : getPrintSize(item.size!).price;
      const href =
        item.kind === "original"
          ? `/shop/originals/${painting.id}`
          : `/shop/prints/${painting.id}`;
      const meta =
        item.kind === "original"
          ? `Original · ${painting.medium}`
          : `Print · ${getPrintSize(item.size!).label}`;
      return { index, painting, price, href, meta };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const total = rows.reduce((sum, r) => sum + r.price, 0);

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
          <div className={styles.row} key={`${row.painting.id}-${row.index}`}>
            <div className={styles.thumb}>
              <Image
                src={row.painting.image}
                alt={row.painting.title}
                fill
                sizes="120px"
                className={styles.thumbImg}
              />
            </div>
            <div className={styles.rowInfo}>
              <Link href={row.href} className={styles.rowTitle}>
                {row.painting.title}
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
              aria-label={`Remove ${row.painting.title} from cart`}
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

      <button className={styles.checkout}>Checkout</button>
    </section>
  );
}
