"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import styles from "./styles.module.css";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Only clear once we know payment actually succeeded — this page only
    // renders after Stripe redirects back from a completed session.
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.page}>
      <span className={styles.eyebrow}>Order confirmed</span>
      <h1>Thank you.</h1>
      <p>
        Your payment went through — a confirmation email from Stripe is on its
        way, and we&apos;ll be in touch shortly about shipping details.
      </p>
      <Link href="/works" className={styles.link}>
        Continue browsing &rarr;
      </Link>
    </section>
  );
}
