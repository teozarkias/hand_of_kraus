import Image from "next/image";
import Link from "next/link";
import PurchaseOptions from "@/components/PurchaseOptions";
import styles from "./ProductDetail.module.css";

// Works for both a full Painting and a lighter TarotCard — only id, title,
// image, and price are required; the rest are optional so tarot cards
// (which don't have medium/year/size/available) still fit.
interface DetailItem {
  id: string;
  title: string;
  image: string;
  price: number;
  medium?: string;
  year?: string;
  size?: string;
  available?: boolean;
}

export default function ProductDetail({
  painting,
  kind,
  backHref,
  backLabel,
}: {
  painting: DetailItem;
  kind: "original" | "print" | "tarot";
  backHref: string;
  backLabel: string;
}) {
  const eyebrow =
    kind === "original"
      ? "Original · one of one"
      : kind === "print"
        ? "Print"
        : "Tarot card";

  return (
    <div className={styles.detail}>
      <Link href={backHref} className={styles.back}>
        &larr; {backLabel}
      </Link>

      <div className={styles.detailGrid}>
        <div className={styles.detailImg}>
          <Image
            src={painting.image}
            alt={painting.title}
            width={480}
            height={640}
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1>{painting.title}</h1>

          {(painting.medium || painting.year || painting.size) && (
            <div className={styles.plaque}>
              {painting.medium && (
                <div>
                  <span className={styles.k}>Medium</span>
                  <span className={styles.v}>{painting.medium}</span>
                </div>
              )}
              {painting.year && (
                <div>
                  <span className={styles.k}>Year</span>
                  <span className={styles.v}>{painting.year}</span>
                </div>
              )}
              {painting.size && (
                <div>
                  <span className={styles.k}>
                    {kind === "original" ? "Dimensions" : "Original size"}
                  </span>
                  <span className={styles.v}>{painting.size}</span>
                </div>
              )}
              {kind === "original" && (
                <div>
                  <span className={styles.k}>Availability</span>
                  <span className={styles.v}>
                    {painting.available ? "1 available" : "Sold"}
                  </span>
                </div>
              )}
            </div>
          )}

          {(kind !== "original" || painting.available) && (
            <PurchaseOptions
              paintingId={painting.id}
              kind={kind}
              originalPrice={painting.price}
            />
          )}
        </div>
      </div>
    </div>
  );
}
