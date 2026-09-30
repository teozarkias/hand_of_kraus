import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-auth";
import { getTarotCardById } from "@/lib/tarot";
import TarotForm from "../TarotForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditTarotCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const card = await getTarotCardById(id);
  if (!card) notFound();

  return (
    <section className={styles.page}>
      <Link href="/admin" className={styles.back}>
        &larr; Studio
      </Link>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Tarot</span>
          <h1 className={styles.title}>{card.title}</h1>
        </div>
        <Link href={`/shop/tarot/${card.id}`} className={styles.textBtn} target="_blank">
          View on site ↗
        </Link>
      </header>
      <TarotForm card={card} />
    </section>
  );
}
