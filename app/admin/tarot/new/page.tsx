import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import TarotForm from "../TarotForm";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewTarotCardPage() {
  await requireAdminPage();

  return (
    <section className={styles.page}>
      <Link href="/admin" className={styles.back}>
        &larr; Studio
      </Link>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Tarot</span>
          <h1 className={styles.title}>Add a tarot card</h1>
        </div>
      </header>
      <TarotForm />
    </section>
  );
}
