"use client";

import { useRef, useState } from "react";
import styles from "./ZoomableImage.module.css";

export default function ZoomableImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Same "magnifying glass" pan as the Works lightbox: transform-origin
  // follows the cursor directly (no React re-render per frame) so the
  // zoomed image tracks the mouse smoothly.
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
      imgRef.current.style.transformOrigin = "50% 50%";
    }
  }

  return (
    <div
      className={styles.viewport}
      onMouseMove={handleMouseMove}
      onClick={toggleZoom}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${styles.img} ${zoomed ? styles.zoomed : ""}`}
      />
    </div>
  );
}
