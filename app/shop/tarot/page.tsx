import Link from "next/link";
import { getAllTarotCards } from "@/lib/tarot";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

export default function TarotShopPage() {
  const cards = getAllTarotCards();

  return (
    <PreloadGate images={cards.map((c) => c.image)}>
      <div className={styles.topBar}>
        <Link href="/shop" className={styles.back}>
          &larr; Shop
        </Link>
      </div>

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Tarot · in progress</span>
        <h1>An original 78-card deck, drawn in the same hand.</h1>
        <p>
          The full deck isn&apos;t available yet, but finished cards can be
          bought individually below.
        </p>
      </div>

      <section className={styles.grid}>
        {cards.map((card, index) => (
          <Link
            key={card.id}
            href={`/shop/tarot/${card.id}`}
            className={styles.piece}
            style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            </div>
            <div className={styles.pieceTitle}>{card.title}</div>
          </Link>
        ))}
      </section>
    </PreloadGate>
  );
}
