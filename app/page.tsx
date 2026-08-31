import { paintings } from "@/lib/paintings";
import { tarotCards } from "@/lib/tarot";
import PreloadGate from "@/components/PreloadGate";
import SitePreloader from "@/components/SitePreloader";
import styles from "./page.module.css";

const HERO_IMAGE = "/paintings/Dead_Sea.jpg";

export default function HomePage() {
  const preloadImages = [HERO_IMAGE];

  const siteWideImages = [
    ...paintings.map((p) => p.image),
    ...tarotCards.flatMap((c) =>
      c.previewImageThumb
        ? [c.previewImageThumb, c.imageThumb]
        : [c.imageThumb],
    ),
  ];

  return (
    <PreloadGate images={preloadImages}>
      <SitePreloader images={siteWideImages} />

      <div className={styles.page}>
        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className={styles.heroImg} />
        </div>

        <section className={styles.socials}>
          <a
            href="https://www.instagram.com/hand_of_kraus/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <span className={styles.divider}>·</span>
          <a
            href="https://www.tiktok.com/@hand_of_kraus"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok
          </a>
        </section>
      </div>
    </PreloadGate>
  );
}
