import Link from "next/link";
import Image from "next/image";
import { paintings } from "@/lib/paintings";
import { tarotCards } from "@/lib/tarot";
import styles from "./page.module.css";

const categories = [
  {
    slug: "originals",
    title: "Originals",
    image: paintings[0]?.image,
    available: true,
  },
  {
    slug: "prints",
    title: "Prints",
    image: paintings[2]?.image,
    available: true,
  },
  {
    slug: "tarot",
    title: "Tarot",
    image: tarotCards[0]?.image,
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
                fill
                sizes="34vw"
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
                fill
                sizes="34vw"
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
