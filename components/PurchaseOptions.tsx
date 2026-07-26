"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { PRINT_SIZES, type PrintSizeId } from "@/lib/pricing";
import styles from "./PurchaseOptions.module.css";

export default function PurchaseOptions({
  paintingId,
  kind,
  originalPrice,
}: {
  paintingId: string;
  kind: "original" | "print";
  originalPrice: number;
}) {
  const { addItem } = useCart();
  const [sizeId, setSizeId] = useState<PrintSizeId>("a4");
  const [added, setAdded] = useState(false);

  const selectedSize = PRINT_SIZES.find((s) => s.id === sizeId)!;
  const price = kind === "original" ? originalPrice : selectedSize.price;

  function handleAdd() {
    if (kind === "original") {
      addItem({ paintingId, kind: "original" });
    } else {
      addItem({ paintingId, kind: "print", size: sizeId });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div>
      {/* Size choice only applies to prints — an original is one physical
          object, so there's nothing to choose a size of. */}
      {kind === "print" && (
        <div className={styles.sizeRow}>
          <span className={styles.sizeLabel}>Size</span>
          <div className={styles.sizeOptions}>
            {PRINT_SIZES.map((s) => (
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
