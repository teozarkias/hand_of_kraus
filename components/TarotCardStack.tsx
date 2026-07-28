import styles from "./TarotCardStack.module.css";

// A tarot card that has both a raw preview sketch and a finished framed
// version stacks them: the preview shows by default, and hovering slides
// the finished card down from above to reveal it — like drawing the real
// card out from behind the sketch. Cards with only one image (no pairing
// confirmed yet) just render flat, no stacking.
export default function TarotCardStack({
  previewSrc,
  finalSrc,
  alt,
}: {
  previewSrc: string;
  finalSrc?: string;
  alt: string;
}) {
  if (!finalSrc) {
    return (
      <div className={styles.single}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={styles.singleImg}
        />
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={styles.front}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className={styles.back}
      />
    </div>
  );
}
