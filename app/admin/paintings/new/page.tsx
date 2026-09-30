import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import PaintingForm from "../PaintingForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewPaintingPage() {
  await requireAdminPage();

  return (
    <section className={styles.page}>
      <Link href="/admin" className={styles.back}>
        &larr; Studio
      </Link>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Paintings</span>
          <h1 className={styles.title}>Add a painting</h1>
        </div>
      </header>
      <PaintingForm />
    </section>
  );
}
