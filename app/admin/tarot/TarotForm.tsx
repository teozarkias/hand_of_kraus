"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TarotCard } from "@/lib/tarot";
import { PRINT_SIZES } from "@/lib/pricing";
import { uploadArtImage } from "@/lib/upload-image";
import { saveTarotCard } from "../actions";
import ImagePicker from "../ImagePicker";
import styles from "../admin.module.css";

const STANDARD_SIZES_TEXT = PRINT_SIZES.map((s) => `${s.label} €${s.price}`).join(", ");

// Add + edit form for a tarot card. With `card` it edits that card;
// without it, it creates a new one.
export default function TarotForm({ card }: { card?: TarotCard }) {
  const router = useRouter();
  const isEdit = Boolean(card);

  const [title, setTitle] = useState(card?.title ?? "");
  const [framedFile, setFramedFile] = useState<File | null>(null);
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const [sketchRemoved, setSketchRemoved] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isEdit && !framedFile) {
      setError("Choose the framed card image.");
      return;
    }

    setSaving(true);
    try {
      let image = card?.image ?? "";
      let previewImage: string | null = sketchRemoved ? null : (card?.previewImage ?? null);

      if (framedFile) {
        setStatus("Uploading framed card…");
        image = await uploadArtImage(framedFile, "tarot");
      }
      if (sketchFile) {
        setStatus("Uploading sketch…");
        previewImage = await uploadArtImage(sketchFile, "tarot");
      }

      setStatus("Saving…");
      const result = await saveTarotCard({ id: card?.id, title, image, previewImage });

      if (!result.success) {
        setError(result.message);
        setStatus(null);
        setSaving(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus(null);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Title</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Emperor"
          required
          maxLength={200}
        />
      </label>

      <ImagePicker
        label="Framed card"
        hint={
          isEdit
            ? "Leave empty to keep the current image."
            : "The finished card. Big scans are resized automatically."
        }
        currentUrl={card?.image ?? null}
        file={framedFile}
        onFileChange={setFramedFile}
      />

      <ImagePicker
        label="Sketch (optional)"
        hint="The raw sketch. With one, the card fans out on hover in the shop and buyers can choose sketch or framed."
        currentUrl={card?.previewImage ?? null}
        file={sketchFile}
        onFileChange={setSketchFile}
        removed={sketchRemoved}
        onRemovedChange={setSketchRemoved}
      />

      <p className={styles.hint}>
        Tarot prints are sold in the standard sizes ({STANDARD_SIZES_TEXT}).
      </p>

      {error && <p className={styles.error}>{error}</p>}
      {status && !error && <p className={styles.status}>{status}</p>}

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryBtn} disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add tarot card"}
        </button>
        <Link href="/admin" className={styles.textBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
