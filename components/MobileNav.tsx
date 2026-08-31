"use client";

import { useEffect, useState } from "react";
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
          <nav className={styles.links}>
            <a href="/" onClick={() => setOpen(false)}>
              Home
            </a>
            <a href="/works" onClick={() => setOpen(false)}>
              Works
            </a>
            <a href="/shop" onClick={() => setOpen(false)}>
              Shop
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
