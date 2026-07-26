"use client";

import { useEffect, useRef, useState } from "react";
import type { Painting } from "@/lib/paintings";
import styles from "./Lightbox.module.css";

export default function Lightbox({
  painting,
  onClose,
}: {
  painting: Painting;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Drives the "magnifying glass" pan: the transform-origin follows the
  // cursor directly (no React re-render per frame), so the zoomed image
  // tracks the mouse smoothly instead of relying on scrollbars.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed || !imgRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  }

  function toggleZoom() {
    setZoomed((z) => !z);
    if (imgRef.current) {
      // Reset to center whenever zoom is toggled off, so it doesn't
      // reopen mid-pan from wherever the cursor last was.
      imgRef.current.style.transformOrigin = "50% 50%";
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose} aria-label="Close">
        &times;
      </button>

      <div className={styles.frame} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.viewport}
          onMouseMove={handleMouseMove}
          onClick={toggleZoom}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={painting.image}
            alt=""
            className={`${styles.img} ${zoomed ? styles.zoomed : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
