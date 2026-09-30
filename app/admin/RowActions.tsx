"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deletePainting,
  deleteTarotCard,
  movePainting,
  moveTarotCard,
  type ActionResult,
} from "./actions";
import styles from "./admin.module.css";

// Reorder / edit / delete controls for one row on the admin dashboard.
export default function RowActions({
  kind,
  id,
  title,
  isFirst,
  isLast,
}: {
  kind: "painting" | "tarot";
  id: string;
  title: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.success) setError(result.message);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleMove(direction: "up" | "down") {
    run(() => (kind === "painting" ? movePainting(id, direction) : moveTarotCard(id, direction)));
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}"? It will disappear from the website, and its uploaded image will be removed. This can't be undone.`,
    );
    if (!confirmed) return;
    run(() => (kind === "painting" ? deletePainting(id) : deleteTarotCard(id)));
  }

  const editHref = kind === "painting" ? `/admin/paintings/${id}` : `/admin/tarot/${id}`;

  return (
    <div className={styles.rowActions}>
      {error && <span className={styles.error}>{error}</span>}
      <button
        type="button"
        className={styles.arrowBtn}
        onClick={() => handleMove("up")}
        disabled={pending || isFirst}
        aria-label={`Move ${title} up`}
        title="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        className={styles.arrowBtn}
        onClick={() => handleMove("down")}
        disabled={pending || isLast}
        aria-label={`Move ${title} down`}
        title="Move down"
      >
        ↓
      </button>
      <Link href={editHref} className={styles.textBtn}>
        Edit
      </Link>
      <button type="button" className={styles.textBtn} onClick={handleDelete} disabled={pending}>
        Delete
      </button>
    </div>
  );
}
