"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import styles from "./HeaderCart.module.css";

export default function HeaderCart() {
  const { count } = useCart();

  return (
    // next/link for the same reason as the header nav: a raw anchor forces
    // a full page reload on every click.
    <Link href="/cart" className={styles.cartBtn}>
      Cart · <span>{count}</span>
    </Link>
  );
}
