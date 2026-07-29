import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getTarotCardById, getAllTarotIds } from "@/lib/tarot";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllTarotIds().map((id) => ({ id }));
}

export default async function TarotChoosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = getTarotCardById(id);

  if (!card) {
    notFound();
  }

  if (!card.previewImage) {
    redirect(`/shop/tarot/${card.id}`);
  }

  return (
    <div className={styles.page}>
      <Link href="/shop/tarot" className={styles.back}>
        &larr; Tarot
      </Link>

      <div className={styles.intro}>
        <span className={styles.eyebrow}>{card.title}</span>
        <h1>Which version would you like?</h1>
      </div>

      <div className={styles.options}>
        {/* Thumb versions here too — this is still a browsing/decision
            screen, not the final zoom-focused buy page. */}
        <Link
          href={`/shop/tarot/${card.id}?variant=preview`}
          className={styles.option}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.previewImageThumb}
            alt=""
            className={styles.optionImg}
          />
          <span className={styles.optionLabel}>Sketch</span>
        </Link>

        <Link href={`/shop/tarot/${card.id}`} className={styles.option}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.imageThumb} alt="" className={styles.optionImg} />
          <span className={styles.optionLabel}>Framed Card</span>
        </Link>
      </div>
    </div>
  );
}
