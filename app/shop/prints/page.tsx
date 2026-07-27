import Link from "next/link";
import { paintings } from "@/lib/paintings";
import styles from "./page.module.css";

export default function PrintsShopPage() {
  return (
    <>
      <div className={styles.topBar}>
        <Link href="/shop" className={styles.back}>
          &larr; Shop
        </Link>
      </div>

      <section className={styles.grid}>
        {paintings.map((painting, index) => (
          <Link
            key={painting.id}
            href={`/shop/prints/${painting.id}`}
            className={styles.piece}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={painting.image} alt="" className={styles.image} />
            </div>
            <div className={styles.pieceTitle}>{painting.title}</div>
          </Link>
        ))}
      </section>
    </>
  );
}
