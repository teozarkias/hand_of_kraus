import Image from "next/image";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

const HERO_IMAGE = "/paintings/Dead_Sea.jpg";

export default function HomePage() {
  const preloadImages = [HERO_IMAGE];

  return (
    <PreloadGate images={preloadImages}>
      <div className={styles.page}>
        <div className={styles.hero}>
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className={styles.heroImg}
          />

          <div className={styles.socials}>
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
          </div>
        </div>
      </div>
    </PreloadGate>
  );
}
