import Image from "next/image";
import Link from "next/link";
import { getAllPaintings, getPaintingAspectRatio } from "@/lib/paintings";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

// Only the first row needs to be ready before the page reveals itself —
// blocking on the whole gallery behind the loading curtain is what made
// this page feel like it hung on load.
const PRELOAD_COUNT = 4;

// Cached, then refreshed instantly whenever something is saved in /admin
// (see revalidateSite in app/admin/actions.ts). The 5-minute revalidate is
// just a safety net in case an on-demand refresh is ever missed.
export const revalidate = 300;

export default async function PrintsShopPage() {
  const paintings = await getAllPaintings();

  return (
    <PreloadGate images={paintings.slice(0, PRELOAD_COUNT).map((p) => p.image)}>
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
            className={`${styles.piece} ${painting.wide ? styles.pieceWide : ""}`}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              <Image
                src={painting.image}
                alt=""
                width={1200}
                height={Math.round(1200 / getPaintingAspectRatio(painting))}
                loading={index < PRELOAD_COUNT ? "eager" : "lazy"}
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
                quality={90}
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
