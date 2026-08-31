"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import type { ResolvedPrintSize } from "@/lib/print-sizes";
import styles from "./PurchaseOptions.module.css";

export default function PurchaseOptions({
  paintingId,
  kind,
  originalPrice,
  sizes,
}: {
  paintingId: string;
  kind: "original" | "print" | "tarot";
  originalPrice: number;
  // Resolved size options (label/dims/price) — the caller works out
  // whether this painting/card has a custom override or should fall
  // back to the site-wide default, via lib/print-sizes.ts.
  sizes: ResolvedPrintSize[];
}) {
  const { addItem } = useCart();
  const showSizeChoice =
    (kind === "print" || kind === "tarot") && sizes.length > 0;
  const [sizeId, setSizeId] = useState<string>(sizes[0]?.id ?? "");
  const [added, setAdded] = useState(false);

  const selectedSize = sizes.find((s) => s.id === sizeId);
  const price = showSizeChoice
    ? (selectedSize?.price ?? originalPrice)
    : originalPrice;

  function handleAdd() {
    if (showSizeChoice) {
      addItem({ paintingId, kind, size: sizeId });
    } else {
      addItem({ paintingId, kind });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div>
      {/* Size choice applies to prints and tarot cards — an original is one
          physical object, so there's nothing to choose a size of. */}
      {showSizeChoice && (
        <div className={styles.sizeRow}>
          <span className={styles.sizeLabel}>Size</span>
          <div className={styles.sizeOptions}>
            {sizes.map((s) => (
              <button
                key={s.id}
                className={`${styles.sizeBtn} ${
                  sizeId === s.id ? styles.sizeBtnActive : ""
                }`}
                onClick={() => setSizeId(s.id)}
              >
                <span className={styles.sizeName}>{s.label}</span>
                <span className={styles.sizeDims}>{s.dims}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.priceRow}>
        <div className={styles.price}>
          <span className={styles.cur}>EUR</span>
          {price}
        </div>
      </div>

      <button
        className={`${styles.addCart} ${added ? styles.added : ""}`}
        onClick={handleAdd}
      >
        {added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}
