"use client";

import { useState } from "react";
import { paintings, type Painting } from "@/lib/paintings";
import Lightbox from "@/components/Lightbox";
import styles from "./page.module.css";

export default function WorksPage() {
  const [active, setActive] = useState<Painting | null>(null);

  return (
    <>
      <section className={`${styles.grid} ${active ? styles.gridBlurred : ""}`}>
        {paintings.map((painting, index) => (
          <button
            key={painting.id}
            className={styles.piece}
            onClick={() => setActive(painting)}
            aria-label={`View ${painting.title}`}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={painting.image} alt="" className={styles.image} />
            <span className={styles.title}>{painting.title}</span>
          </button>
        ))}
      </section>

      {active && <Lightbox painting={active} onClose={() => setActive(null)} />}
    </>
  );
}
