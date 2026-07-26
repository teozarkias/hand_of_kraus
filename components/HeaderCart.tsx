"use client";

import { useCart } from "@/lib/CartContext";
import styles from "./HeaderCart.module.css";

export default function HeaderCart() {
  const { count } = useCart();

  return (
    <a href="/cart" className={styles.cartBtn}>
      Cart · <span>{count}</span>
    </a>
  );
}
