"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Painting } from "@/lib/painting-utils";
import styles from "./Lightbox.module.css";

// Zooms up to 2.4x (see styles.zoomed) — sizes asks for more than the
// resting box width so next/image doesn't optimize the derivative down to
// a size that turns soft once zoomed. Width/height are just an
// aspect-ratio hint for srcset math; real layout comes from the actual
// downloaded image once it loads.
const IMAGE_WIDTH = 1800;
const IMAGE_HEIGHT = 2200;

export default function Lightbox({
  painting,
  onClose,
}: {
  painting: Painting;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Cached instead of re-measured on every mousemove — see ZoomableImage
  // for why: getBoundingClientRect forces a layout read, and doing that on
  // every event (mousemove can fire far more often than the screen
  // repaints) is what was making panning feel laggy.
  const rectRef = useRef<DOMRect | null>(null);
  const pendingOriginRef = useRef<{ x: number; y: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [onClose]);

  function applyPendingOrigin() {
    rafIdRef.current = null;
    const origin = pendingOriginRef.current;
    if (!origin || !imgRef.current) return;
    imgRef.current.style.transformOrigin = `${origin.x}% ${origin.y}%`;
  }

  // Drives the "magnifying glass" pan: the transform-origin follows the
  // cursor directly (no React re-render per frame), so the zoomed image
  // tracks the mouse smoothly instead of relying on scrollbars. The style
  // write is batched to one per animation frame via rAF, instead of once
  // per raw mousemove event.
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
    // Force a fresh measurement next time zoom turns on.
    rectRef.current = null;
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
          <Image
            ref={imgRef}
            src={painting.image}
            alt=""
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            sizes="(max-width: 700px) 170vw, 2160px"
            quality={90}
            priority
            className={`${styles.img} ${zoomed ? styles.zoomed : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
