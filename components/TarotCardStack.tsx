import styles from "./TarotCardStack.module.css";

// A tarot card that has both a raw preview sketch and a finished framed
// version stacks them: the preview shows by default, and hovering fans
// the finished card out from behind it. Cards with only one image just
// render flat, no stacking.
//
// Both images render immediately (hover only reveals the back one, it
// never mounts a new element on demand) — so there's no reason to lazy
// load either one here. The page that uses this already preloads and
// fully decodes both images ahead of time (see PreloadGate); loading
// these eagerly too means the browser's own native image pipeline is
// working with that decode-ahead effort instead of against it.
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
          loading="eager"
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
        loading="eager"
        decoding="async"
        className={styles.front}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt=""
        loading="eager"
        decoding="async"
        className={styles.back}
      />
    </div>
  );
}
