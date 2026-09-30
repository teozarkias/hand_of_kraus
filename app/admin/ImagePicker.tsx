"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./admin.module.css";

// File chooser with a live preview. It only picks the file — the parent
// form uploads it when "Save" is pressed, so nothing is uploaded for a form
// that ends up being abandoned.
export default function ImagePicker({
  label,
  hint,
  currentUrl,
  file,
  onFileChange,
  removed = false,
  onRemovedChange,
}: {
  label: string;
  hint?: string;
  currentUrl: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  // Only for optional images (the tarot sketch): lets the admin clear it.
  removed?: boolean;
  onRemovedChange?: (removed: boolean) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(
    function makePreviewUrl() {
      if (!file) {
        setObjectUrl(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    },
    [file],
  );

  const shownUrl = objectUrl ?? (removed ? null : currentUrl);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.imagePicker}>
        <div className={styles.preview}>
          {shownUrl ? (
            <Image
              src={shownUrl}
              alt=""
              fill
              sizes="140px"
              className={styles.previewImg}
              // Local previews (blob: URLs) can't go through the optimizer.
              unoptimized={Boolean(objectUrl)}
            />
          ) : (
            "No image"
          )}
        </div>
        <div className={styles.field}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.fileInput}
            onChange={(e) => {
              onFileChange(e.target.files?.[0] ?? null);
              onRemovedChange?.(false);
            }}
          />
          {hint && <span className={styles.hint}>{hint}</span>}
          {file && (
            <button type="button" className={styles.textBtn} onClick={() => onFileChange(null)}>
              Undo new image
            </button>
          )}
          {onRemovedChange && currentUrl && !file && (
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={removed}
                onChange={(e) => onRemovedChange(e.target.checked)}
              />
              <span>Remove this image</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
