import Link from "next/link";
import { getOriginalsForSale } from "@/lib/paintings";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

export default function OriginalsShopPage() {
  const paintings = getOriginalsForSale();

  return (
    <PreloadGate images={paintings.map((p) => p.image)}>
      <div className={styles.topBar}>
        <Link href="/shop" className={styles.back}>
          &larr; Shop
        </Link>
      </div>

      <section className={styles.grid}>
        {paintings.map((painting, index) => (
          <Link
            key={painting.id}
            href={`/shop/originals/${painting.id}`}
            className={`${styles.piece} ${painting.id === "dead-sea" ? styles.pieceWide : ""}`}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={painting.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            </div>
            <div className={styles.pieceTitle}>{painting.title}</div>
          </Link>
        ))}
      </section>
    </PreloadGate>
  );
}
