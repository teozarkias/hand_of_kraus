"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Painting } from "@/lib/painting-utils";
import { PRINT_SIZES } from "@/lib/pricing";
import { uploadArtImage } from "@/lib/upload-image";
import { savePainting } from "../actions";
import ImagePicker from "../ImagePicker";
import styles from "../admin.module.css";

interface SizeRow {
  id?: string;
  label: string;
  dims: string;
  price: string; // kept as text while typing
}

const STANDARD_SIZES_TEXT = PRINT_SIZES.map((s) => `${s.label} €${s.price}`).join(", ");

// Add + edit form for a painting. With `painting` it edits that piece;
// without it, it creates a new one.
export default function PaintingForm({ painting }: { painting?: Painting }) {
  const router = useRouter();
  const isEdit = Boolean(painting);

  const [title, setTitle] = useState(painting?.title ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [medium, setMedium] = useState(painting?.medium ?? "Ink on paper");
  const [size, setSize] = useState(painting?.size ?? "");
  const [year, setYear] = useState(painting?.year ?? String(new Date().getFullYear()));
  const [price, setPrice] = useState(painting ? String(painting.price) : "");
  const [originalForSale, setOriginalForSale] = useState(painting?.originalForSale !== false);
  const [available, setAvailable] = useState(painting?.available ?? true);
  const [featured, setFeatured] = useState(painting?.featured ?? false);
  const [wide, setWide] = useState(painting?.wide ?? false);
  const [customSizes, setCustomSizes] = useState(Boolean(painting?.printSizes?.length));
  const [sizes, setSizes] = useState<SizeRow[]>(
    painting?.printSizes?.length
      ? painting.printSizes.map((s) => ({ id: s.id, label: s.label, dims: s.dims, price: String(s.price) }))
      : PRINT_SIZES.map((s) => ({ label: s.label, dims: s.dims, price: String(s.price) })),
  );

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateSize(index: number, patch: Partial<SizeRow>) {
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addSize() {
    setSizes((prev) => [...prev, { label: "", dims: "", price: "" }]);
  }

  function removeSize(index: number) {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isEdit && !file) {
      setError("Choose an image of the painting.");
      return;
    }

    setSaving(true);
    try {
      let image = painting?.image ?? "";
      if (file) {
        setStatus("Uploading image… (large scans can take a moment)");
        image = await uploadArtImage(file, "paintings");
      }

      setStatus("Saving…");
      const result = await savePainting({
        id: painting?.id,
        title,
        image,
        medium,
        size,
        year,
        price: Number(price),
        available,
        featured,
        originalForSale,
        wide,
        printSizes: customSizes
          ? sizes.map((s) => ({ id: s.id, label: s.label, dims: s.dims, price: Number(s.price) }))
          : null,
      });

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
          required
          maxLength={200}
        />
      </label>

      <ImagePicker
        label="Image"
        hint={
          isEdit
            ? "Leave empty to keep the current image. Big scans are resized automatically."
            : "JPG, PNG or WebP. Big scans are resized automatically — no need to shrink them first."
        }
        currentUrl={painting?.image ?? null}
        file={file}
        onFileChange={setFile}
      />

      <div className={styles.grid2}>
        <label className={styles.field}>
          <span className={styles.label}>Medium</span>
          <input className={styles.input} value={medium} onChange={(e) => setMedium(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Year</span>
          <input className={styles.input} value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Size of the original</span>
        <input
          className={styles.input}
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="21 × 29.7 cm"
        />
        <span className={styles.hint}>
          Width × height, like &quot;21 × 29.7 cm&quot;. Also used to lay the
          gallery out before the image loads.
        </span>
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>The original</legend>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={originalForSale}
            onChange={(e) => setOriginalForSale(e.target.checked)}
          />
          <span>
            Sell the original
            <span className={styles.checkboxHint}>
              Untick to keep the physical piece and only sell prints of it.
            </span>
          </span>
        </label>

        {originalForSale && (
          <>
            <label className={styles.field}>
              <span className={styles.label}>Price of the original (EUR)</span>
              <input
                className={styles.input}
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <span>
                Still available
                <span className={styles.checkboxHint}>
                  Untick once it&apos;s sold — the page stays up, but it can&apos;t be bought.
                </span>
              </span>
            </label>
          </>
        )}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Prints</legend>

        <label className={styles.checkbox}>
          <input type="radio" checked={!customSizes} onChange={() => setCustomSizes(false)} />
          <span>
            Standard sizes
            <span className={styles.checkboxHint}>{STANDARD_SIZES_TEXT}</span>
          </span>
        </label>
        <label className={styles.checkbox}>
          <input type="radio" checked={customSizes} onChange={() => setCustomSizes(true)} />
          <span>Custom sizes for this painting</span>
        </label>

        {customSizes && (
          <>
            {sizes.map((row, index) => (
              <div key={index} className={styles.grid3}>
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    className={styles.input}
                    value={row.label}
                    onChange={(e) => updateSize(index, { label: e.target.value })}
                    placeholder="A3"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Dimensions</span>
                  <input
                    className={styles.input}
                    value={row.dims}
                    onChange={(e) => updateSize(index, { dims: e.target.value })}
                    placeholder="29.7 × 42 cm"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>EUR</span>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    step="1"
                    inputMode="decimal"
                    value={row.price}
                    onChange={(e) => updateSize(index, { price: e.target.value })}
                  />
                </label>
                {sizes.length > 1 && (
                  <button type="button" className={styles.textBtn} onClick={() => removeSize(index)}>
                    Remove size
                  </button>
                )}
              </div>
            ))}
            <div>
              <button type="button" className={styles.secondaryBtn} onClick={addSize}>
                + Add size
              </button>
            </div>
          </>
        )}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Display</legend>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={wide} onChange={(e) => setWide(e.target.checked)} />
          <span>
            Show large
            <span className={styles.checkboxHint}>
              Takes up two columns in the gallery grids (like Dead Sea).
            </span>
          </span>
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <span>Featured</span>
        </label>
      </fieldset>

      {error && <p className={styles.error}>{error}</p>}
      {status && !error && <p className={styles.status}>{status}</p>}

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryBtn} disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add painting"}
        </button>
        <Link href="/admin" className={styles.textBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
