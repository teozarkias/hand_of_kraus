"use client";

import { useEffect, useState } from "react";
import styles from "./PreloadGate.module.css";

// Wraps a page's content and keeps a full-screen loading cover up until
// every image in `images` has either loaded or failed — then fades the
// cover out and reveals the real content in one smooth motion, instead of
// letting the audience watch images pop in one by one as they download.
export default function PreloadGate({
  images,
  children,
}: {
  images: string[];
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      setReady(true);
      return;
    }

    let loadedCount = 0;
    let cancelled = false;

    // Safety net: never block the page forever if one image is huge,
    // slow, or 404s without firing a clean error event.
    const fallback = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 5000);

    function markLoaded() {
      loadedCount += 1;
      if (loadedCount >= images.length && !cancelled) {
        clearTimeout(fallback);
        setReady(true);
      }
    }

    images.forEach((src) => {
      const img = new window.Image();
      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = src;
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [images]);

  return (
    <>
      <div className={`${styles.cover} ${ready ? styles.coverHidden : ""}`}>
        <div className={styles.mark}>Kraus</div>
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
      </div>
      <div
        className={`${styles.content} ${ready ? styles.contentVisible : ""}`}
      >
        {children}
      </div>
    </>
  );
}
