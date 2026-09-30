"use client";

import { createClient } from "@supabase/supabase-js";
import { createImageUpload } from "@/app/admin/actions";
import { ART_BUCKET } from "./supabase-constants";

// Same limits as scripts/resize-images.js: nothing on this site ever shows
// more detail than 2600px wide (even zoomed in), and 92% JPEG quality is
// visually identical to the original for ink work.
const MAX_WIDTH = 2600;
const JPEG_QUALITY = 0.92;
// Small, already-web-sized files are uploaded untouched.
const SKIP_RESIZE_UNDER_BYTES = 3 * 1024 * 1024;

// Browser-side Supabase client. It only uses the PUBLIC anon key, which is
// safe to expose: the database tables have no public access at all (see
// supabase/schema.sql), and uploads need a one-time token that only the
// logged-in admin can get from the server.
function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Uploads aren't configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

async function shrinkIfNeeded(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const alreadySmall =
    bitmap.width <= MAX_WIDTH &&
    file.size <= SKIP_RESIZE_UNDER_BYTES &&
    /^image\/(jpeg|webp)$/.test(file.type);

  if (alreadySmall) {
    bitmap.close();
    return file;
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process this image.");

  // White underneath, so a transparent PNG doesn't turn black as a JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Your browser couldn't process this image.");

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

// Resizes (if needed) and uploads one image straight from the browser to
// Supabase Storage, returning its public URL.
export async function uploadArtImage(file: File, folder: "paintings" | "tarot"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" isn't an image.`);
  }

  const prepared = await shrinkIfNeeded(file);

  const ticket = await createImageUpload(folder, prepared.name);
  if (!ticket.success || !ticket.data) throw new Error(ticket.message);

  const { error } = await getBrowserClient()
    .storage.from(ART_BUCKET)
    .uploadToSignedUrl(ticket.data.path, ticket.data.token, prepared, {
      contentType: prepared.type,
      cacheControl: "31536000", // file names are unique, so cache forever
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return ticket.data.publicUrl;
}
