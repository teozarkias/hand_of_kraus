import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-auth";
import { getPaintingById } from "@/lib/paintings";
import PaintingForm from "../PaintingForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditPaintingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const painting = await getPaintingById(id);
  if (!painting) notFound();

  return (
    <section className={styles.page}>
      <Link href="/admin" className={styles.back}>
        &larr; Studio
      </Link>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Paintings</span>
          <h1 className={styles.title}>{painting.title}</h1>
        </div>
        <Link href={`/shop/prints/${painting.id}`} className={styles.textBtn} target="_blank">
          View on site ↗
        </Link>
      </header>
      <PaintingForm painting={painting} />
    </section>
  );
}
