import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTarotCardById, getAllTarotIds } from "@/lib/tarot";
import styles from "./page.module.css";

// Aspect-ratio hint only — see TarotCardStack for why the exact numbers
// don't matter to how it renders.
const CARD_WIDTH = 900;
const CARD_HEIGHT = 1500;

// Cached, then refreshed instantly whenever something is saved in /admin.
export const revalidate = 300;

// Pre-builds every existing card for speed. Cards added later through
// /admin aren't in this list, but still work: Next renders them on first
// visit and caches them from then on.
export async function generateStaticParams() {
  return (await getAllTarotIds()).map((id) => ({ id }));
}

export default async function TarotChoosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getTarotCardById(id);

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
          <Image
            src={card.previewImageThumb!}
            alt=""
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            sizes="(max-width: 600px) 90vw, 45vw"
            quality={90}
            className={styles.optionImg}
          />
          <span className={styles.optionLabel}>Sketch</span>
        </Link>

        <Link href={`/shop/tarot/${card.id}`} className={styles.option}>
          <Image
            src={card.imageThumb}
            alt=""
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            sizes="(max-width: 600px) 90vw, 45vw"
            quality={90}
            className={styles.optionImg}
          />
          <span className={styles.optionLabel}>Framed Card</span>
        </Link>
      </div>
    </div>
  );
}
