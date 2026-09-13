import Image from "next/image";
import styles from "./TarotCardStack.module.css";

// A rough tarot-card proportion, just so next/image has an aspect ratio
// hint — the browser still lays each image out at its real dimensions
// once it downloads (see getPaintingAspectRatio in lib/paintings.ts for
// the same reasoning), so this doesn't need to be exact.
const CARD_WIDTH = 900;
const CARD_HEIGHT = 1500;

// A tarot card that has both a raw preview sketch and a finished framed
// version stacks them: the preview shows by default, and hovering fans
// the finished card out from behind it. Cards with only one image just
// render flat, no stacking.
//
// These are already the small "-thumb" versions of each card, so eagerly
// loading the handful in the first visible row (via the `eager` prop) is
// cheap; everything past that lazy-loads as the grid scrolls into view
// instead of every card on the page fetching at once.
export default function TarotCardStack({
  previewSrc,
  finalSrc,
  alt,
  eager = false,
}: {
  previewSrc: string;
  finalSrc?: string;
  alt: string;
  eager?: boolean;
}) {
  const loading = eager ? "eager" : "lazy";

  if (!finalSrc) {
    return (
      <div className={styles.single}>
        <Image
          src={previewSrc}
          alt={alt}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          loading={loading}
          sizes="(max-width: 600px) 45vw, 22vw"
          quality={90}
          className={styles.singleImg}
        />
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <Image
        src={previewSrc}
        alt={alt}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        loading={loading}
        sizes="(max-width: 600px) 45vw, 22vw"
        quality={90}
        className={styles.front}
      />
      <Image
        src={finalSrc}
        alt=""
        fill
        loading={loading}
        sizes="(max-width: 600px) 45vw, 22vw"
        quality={90}
        className={styles.back}
      />
    </div>
  );
}
