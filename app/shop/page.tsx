import Image from "next/image";
import Link from "next/link";
import { getPaintingById } from "@/lib/paintings";
import { getTarotCardById } from "@/lib/tarot";
import styles from "./page.module.css";

// Real pixel dimensions aren't needed here: on desktop these tiles are
// absolutely positioned with object-fit: cover (governed entirely by
// styles.categoryImg), and on mobile the CSS switches them to a normal
// width:100%/height:auto flow image, so the browser sizes them from the
// actual downloaded file either way. This pair is just a hint Next uses
// to pick reasonable responsive widths.
const CATEGORY_IMAGE_DIMENSIONS = { width: 1200, height: 1500 };

const printsImage = getPaintingById("immortality")?.image;
// Deliberately the raw/unframed sketch, not the finished framed card.
const tarotImage = getTarotCardById("the-magician-ii")?.previewImage;

const categories = [
  {
    slug: "originals",
    title: "Originals",
    image: getPaintingById("killers-of-the-southern-oracle")?.image,
    available: true,
  },
  {
    slug: "prints",
    title: "Prints",
    image: printsImage,
    available: true,
  },
  {
    slug: "tarot",
    title: "Tarot",
    image: tarotImage,
    available: true,
  },
];

export default function ShopPage() {
  return (
    <section className={styles.grid}>
      {categories.map((cat) =>
        cat.available ? (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className={styles.category}
          >
            {cat.image && (
              <Image
                src={cat.image}
                alt={cat.title}
                {...CATEGORY_IMAGE_DIMENSIONS}
                sizes="(max-width: 860px) 100vw, 33vw"
                quality={90}
                className={styles.categoryImg}
              />
            )}
            <div className={styles.categoryLabel}>{cat.title}</div>
          </Link>
        ) : (
          <div key={cat.slug} className={styles.categoryDisabled}>
            {cat.image && (
              <Image
                src={cat.image}
                alt={cat.title}
                {...CATEGORY_IMAGE_DIMENSIONS}
                sizes="(max-width: 860px) 100vw, 33vw"
                quality={90}
                className={styles.categoryImg}
              />
            )}
            <div className={styles.categoryLabel}>
              {cat.title}
              <span className={styles.soon}>Coming soon</span>
            </div>
          </div>
        ),
      )}
    </section>
  );
}
