"use client";

import { useState } from "react";
import Image from "next/image";
import { getPaintingAspectRatio, type Painting } from "@/lib/painting-utils";
import Lightbox from "@/components/Lightbox";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

// Only the first row needs to be ready before the page reveals itself —
// blocking on the whole gallery behind the loading curtain is what was
// making this page feel like it hung on load.
const PRELOAD_COUNT = 4;

// The interactive half of the Works page (grid + lightbox state). The data
// itself is fetched on the server in page.tsx and handed in as a prop.
export default function WorksGallery({ paintings }: { paintings: Painting[] }) {
  const [active, setActive] = useState<Painting | null>(null);

  return (
    <PreloadGate images={paintings.slice(0, PRELOAD_COUNT).map((p) => p.image)}>
      <section className={`${styles.grid} ${active ? styles.gridBlurred : ""}`}>
        {paintings.map((painting, index) => (
          <button
            key={painting.id}
            className={`${styles.piece} ${painting.wide ? styles.pieceWide : ""}`}
            onClick={() => setActive(painting)}
            aria-label={`View ${painting.title}`}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            <Image
              src={painting.image}
              alt=""
              width={1200}
              height={Math.round(1200 / getPaintingAspectRatio(painting))}
              loading={index < PRELOAD_COUNT ? "eager" : "lazy"}
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
              quality={90}
              className={styles.image}
            />
            <span className={styles.title}>{painting.title}</span>
          </button>
        ))}
      </section>

      {active && <Lightbox painting={active} onClose={() => setActive(null)} />}
    </PreloadGate>
  );
}
