import Image from "next/image";
import Link from "next/link";
import type { Painting } from "@/lib/paintings";
import PurchaseOptions from "@/components/PurchaseOptions";
import styles from "./ProduceDetail.module.css";

export default function ProductDetail({
  painting,
  kind,
  backHref,
  backLabel,
}: {
  painting: Painting;
  kind: "original" | "print";
  backHref: string;
  backLabel: string;
}) {
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
          <span className={styles.eyebrow}>
            {kind === "original" ? "Original · one of one" : "Print"}
          </span>
          <h1>{painting.title}</h1>

          <div className={styles.plaque}>
            <div>
              <span className={styles.k}>Medium</span>
              <span className={styles.v}>{painting.medium}</span>
            </div>
            <div>
              <span className={styles.k}>Year</span>
              <span className={styles.v}>{painting.year}</span>
            </div>
            <div>
              <span className={styles.k}>
                {kind === "original" ? "Dimensions" : "Original size"}
              </span>
              <span className={styles.v}>{painting.size}</span>
            </div>
            {kind === "original" && (
              <div>
                <span className={styles.k}>Availability</span>
                <span className={styles.v}>
                  {painting.available ? "1 available" : "Sold"}
                </span>
              </div>
            )}
          </div>

          {(kind === "print" || painting.available) && (
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
