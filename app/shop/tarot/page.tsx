import Link from "next/link";
import Image from "next/image";
import { getAllTarotCards } from "@/lib/tarot";
import styles from "./page.module.css";

export default function TarotShopPage() {
  const cards = getAllTarotCards();

  return (
    <>
      <div className={styles.topBar}>
        <Link href="/shop" className={styles.back}>
          &larr; Shop
        </Link>
      </div>

      <div className={styles.intro}>
        <span className={styles.eyebrow}>Tarot · in progress</span>
        <h1>An original 78-card deck, drawn in the same hand.</h1>
        <p>
          The full deck isn&apos;t available yet — here&apos;s a preview of the
          cards finished so far.
        </p>
      </div>

      <section className={styles.grid}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={styles.piece}
            style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
          >
            <div className={styles.imgWrap}>
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 20vw"
                className={styles.image}
              />
            </div>
            <div className={styles.pieceTitle}>{card.title}</div>
          </div>
        ))}
      </section>
    </>
  );
}
