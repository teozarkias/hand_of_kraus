import Link from "next/link";
import { getPaintingById } from "@/lib/paintings";
import { getTarotCardById } from "@/lib/tarot";
import styles from "./page.module.css";

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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className={styles.categoryImg}
              />
            )}
            <div className={styles.categoryLabel}>{cat.title}</div>
          </Link>
        ) : (
          <div key={cat.slug} className={styles.categoryDisabled}>
            {cat.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
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
