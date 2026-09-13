"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ZoomableImage.module.css";

// This is a real full-quality product photo shown at up to 2.2x zoom (see
// styles.zoomed), so `sizes` deliberately asks for more than the box's
// resting width — otherwise next/image would optimize for the small
// resting size and the zoomed-in view would look soft. The width/height
// below are just an aspect-ratio hint for next/image's srcset math; the
// browser still lays the image out at its real dimensions once loaded.
const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 2000;

export default function ZoomableImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Cached instead of re-measured on every mousemove — getBoundingClientRect
  // forces a layout read, and doing that on every event (mousemove can fire
  // far more often than the screen repaints) is what was making panning
  // feel laggy. The box doesn't move while you're zoomed into it, so it's
  // safe to measure once and reuse.
  const rectRef = useRef<DOMRect | null>(null);
  const pendingOriginRef = useRef<{ x: number; y: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  function applyPendingOrigin() {
    rafIdRef.current = null;
    const origin = pendingOriginRef.current;
    if (!origin || !imgRef.current) return;
    imgRef.current.style.transformOrigin = `${origin.x}% ${origin.y}%`;
  }

  // Same "magnifying glass" pan as the Works lightbox: transform-origin
  // follows the cursor directly (no React re-render per frame) so the
  // zoomed image tracks the mouse smoothly. The actual style write is
  // batched to one per animation frame via rAF, instead of once per raw
  // mousemove event.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return;
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    pendingOriginRef.current = { x, y };
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(applyPendingOrigin);
    }
  }

  function toggleZoom() {
    setZoomed((z) => !z);
    // Force a fresh measurement next time zoom turns on, in case the page
    // scrolled or resized while it was off.
    rectRef.current = null;
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = "50% 50%";
    }
  }

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      className={styles.viewport}
      onMouseMove={handleMouseMove}
      onClick={toggleZoom}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        sizes="(max-width: 860px) 92vw, 1232px"
        quality={90}
        priority
        className={`${styles.img} ${zoomed ? styles.zoomed : ""}`}
      />
    </div>
  );
}
