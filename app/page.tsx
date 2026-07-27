import Image from "next/image";
import Link from "next/link";
import { getFeaturedPaintings } from "@/lib/paintings";
import PreloadGate from "@/components/PreloadGate";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = getFeaturedPaintings();
  const preloadImages = [...featured.map((p) => p.image), "/artist/artist.jpg"];

  return (
    <PreloadGate images={preloadImages}>
      <section className={styles.featured}>
        {featured.map((painting) => (
          <Link
            key={painting.id}
            href={`/shop/originals/${painting.id}`}
            className={styles.piece}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={painting.image}
              alt=""
              loading="lazy"
              decoding="async"
              className={styles.pieceImg}
            />
          </Link>
        ))}
      </section>

      <section className={styles.bio}>
        <div className={styles.bioText}>
          <span className={styles.eyebrow}>The artist</span>
          <p>
            Every piece begins as a blank sheet and a fine-nib pen — no sketches
            underneath, no digital shortcuts. What you see is thousands of
            individual strokes, built up slowly until a scene comes into focus
            out of the crosshatching.
          </p>
          <p>
            Based in Greece. Each drawing is one of one — once it&apos;s gone,
            it&apos;s gone.
          </p>
        </div>
        <div className={styles.bioImg}>
          <Image
            src="/artist/artist.jpg"
            alt="The artist"
            fill
            sizes="(max-width: 860px) 100vw, 40vw"
            className={styles.bioImgEl}
          />
        </div>
      </section>
    </PreloadGate>
  );
}
