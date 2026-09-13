"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MobileNav.module.css";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className={styles.overlay}>
          <button
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          {/* next/link for the same reason as the header: raw anchors force
              a full page reload on every tap. */}
          <nav className={styles.links}>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/works" onClick={() => setOpen(false)}>
              Works
            </Link>
            <Link href="/shop" onClick={() => setOpen(false)}>
              Shop
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
