import Link from "next/link";
import PurchaseOptions from "@/components/PurchaseOptions";
import ZoomableImage from "@/components/ZoomableImage";
import { getPrintSizesFor } from "@/lib/print-sizes";
import styles from "./ProductDetail.module.css";

// Works for both a full Painting and a lighter TarotCard — only id, title,
// image, and price are required; the rest are optional so tarot cards
// (which don't have medium/year/size/available) still fit. printSizes is
// how a painting can override the site-wide default A4/A5 sizes/prices.
interface DetailItem {
  id: string;
  title: string;
  image: string;
  price: number;
  medium?: string;
  year?: string;
  size?: string;
  available?: boolean;
  printSizes?: { id: string; label: string; dims: string; price: number }[];
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

  // Only prints and tarot cards need a size list — originals are a single
  // physical object. This resolves the painting's own custom sizes if it
  // has any (see lib/paintings.ts), otherwise the site-wide default.
  const sizes = kind !== "original" ? getPrintSizesFor(painting) : [];

  return (
    <div className={styles.detail}>
      <Link href={backHref} className={styles.back}>
        &larr; {backLabel}
      </Link>

      <div className={styles.detailGrid}>
        <div className={styles.detailImg}>
          <ZoomableImage src={painting.image} alt={painting.title} />
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
              sizes={sizes}
            />
          )}
        </div>
      </div>
    </div>
  );
}
