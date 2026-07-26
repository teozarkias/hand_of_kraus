import Link from "next/link";
import Image from "next/image";
import { paintings } from "@/lib/paintings";
import styles from "./page.module.css";

export default function OriginalsShopPage() {
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
            href={`/shop/originals/${painting.id}`}
            className={styles.piece}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              <Image
                src={painting.image}
                alt=""
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
                className={styles.image}
              />
            </div>
            <div className={styles.pieceTitle}>{painting.title}</div>
          </Link>
        ))}
      </section>
    </>
  );
}
