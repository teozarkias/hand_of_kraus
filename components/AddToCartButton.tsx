"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import styles from "./AddToCartButton.module.css";

export default function AddToCartButton({ paintingId }: { paintingId: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(paintingId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      className={`${styles.addCart} ${added ? styles.added : ""}`}
      onClick={handleClick}
    >
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
