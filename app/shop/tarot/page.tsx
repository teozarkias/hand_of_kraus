import Link from "next/link";
import { getAllTarotCards } from "@/lib/tarot";
import PreloadGate from "@/components/PreloadGate";
import TarotCardStack from "@/components/TarotCardStack";
import styles from "./page.module.css";

export default function TarotShopPage() {
  const cards = getAllTarotCards();
  const preloadImages = cards.flatMap((c) =>
    c.previewImage ? [c.previewImage, c.image] : [c.image],
  );

  return (
    <PreloadGate images={preloadImages}>
      <div className={styles.topBar}>
        <Link href="/shop" className={styles.back}>
          &larr; Shop
        </Link>
      </div>

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Tarot · in progress</span>
        <h1>An original 48-card deck of all the Major Arcana.</h1>
        <p>
          The full deck isn't available yet, but finished card prints can be
          bought individually below.
        </p>
      </div>

      <section className={styles.grid}>
        {cards.map((card, index) => (
          <Link
            key={card.id}
            href={
              card.previewImage
                ? `/shop/tarot/${card.id}/choose`
                : `/shop/tarot/${card.id}`
            }
            className={styles.piece}
            style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              <TarotCardStack
                previewSrc={card.previewImage ?? card.image}
                finalSrc={card.previewImage ? card.image : undefined}
                alt=""
              />
            </div>
            <div className={styles.pieceTitle}>{card.title}</div>
          </Link>
        ))}
      </section>
    </PreloadGate>
  );
}
