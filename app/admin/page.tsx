import Image from "next/image";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import { getAllPaintings } from "@/lib/paintings";
import { getAllTarotCards } from "@/lib/tarot";
import { logout } from "./actions";
import RowActions from "./RowActions";
import styles from "./admin.module.css";

// Always fresh — this is where changes are made, so it must never show a
// cached copy.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdminPage();

  const [paintings, tarotCards] = await Promise.all([getAllPaintings(), getAllTarotCards()]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Admin</span>
          <h1 className={styles.title}>Studio</h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.textBtn} target="_blank">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className={styles.textBtn}>
              Log out
            </button>
          </form>
        </div>
      </header>

      <p className={styles.hint}>
        Changes go live on the website as soon as you save. The order here is
        the order on the site — use the arrows to rearrange.
      </p>

      {/* ─── Paintings ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Paintings<span className={styles.count}>{paintings.length}</span>
          </h2>
          <Link href="/admin/paintings/new" className={styles.primaryBtn}>
            + Add painting
          </Link>
        </div>

        {paintings.length === 0 && <p className={styles.empty}>No paintings yet.</p>}

        {paintings.map((painting, index) => (
          <div key={painting.id} className={styles.row}>
            <div className={styles.rowThumb}>
              <Image src={painting.image} alt="" fill sizes="64px" className={styles.rowThumbImg} />
            </div>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>{painting.title}</div>
              <div className={styles.rowMeta}>
                <span>EUR {painting.price}</span>
                {painting.year && <span>{painting.year}</span>}
                {painting.originalForSale === false ? (
                  <span className={`${styles.badge} ${styles.badgeMuted}`}>Prints only</span>
                ) : painting.available ? (
                  <span className={styles.badge}>Original for sale</span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeMuted}`}>Sold</span>
                )}
                {painting.featured && <span className={styles.badge}>Featured</span>}
                {painting.wide && <span className={styles.badge}>Large</span>}
                {painting.printSizes && <span className={styles.badge}>Custom print sizes</span>}
              </div>
            </div>
            <RowActions
              kind="painting"
              id={painting.id}
              title={painting.title}
              isFirst={index === 0}
              isLast={index === paintings.length - 1}
            />
          </div>
        ))}
      </div>

      {/* ─── Tarot ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            Tarot cards<span className={styles.count}>{tarotCards.length}</span>
          </h2>
          <Link href="/admin/tarot/new" className={styles.primaryBtn}>
            + Add tarot card
          </Link>
        </div>

        {tarotCards.length === 0 && <p className={styles.empty}>No tarot cards yet.</p>}

        {tarotCards.map((card, index) => (
          <div key={card.id} className={styles.row}>
            <div className={styles.rowThumb}>
              <Image src={card.imageThumb} alt="" fill sizes="64px" className={styles.rowThumbImg} />
            </div>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>{card.title}</div>
              <div className={styles.rowMeta}>
                {card.previewImage ? (
                  <span className={styles.badge}>Framed + sketch</span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeMuted}`}>Framed only</span>
                )}
              </div>
            </div>
            <RowActions
              kind="tarot"
              id={card.id}
              title={card.title}
              isFirst={index === 0}
              isLast={index === tarotCards.length - 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
