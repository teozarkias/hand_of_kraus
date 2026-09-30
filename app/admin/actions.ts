"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-auth";
import { ADMIN_COOKIE } from "@/lib/admin-session";
import { ART_BUCKET, getSupabaseAdmin, storagePathFromUrl } from "@/lib/supabase";

// Every write the admin panel can make. Each action:
//   1. re-checks the login itself (never trusts that middleware ran),
//   2. validates every field on the server (never trusts the form),
//   3. refreshes the public site so the change shows up immediately.

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

// Throws away every cached page so the public site reflects the change on
// the very next visit — no redeploy needed.
function revalidateSite() {
  revalidatePath("/", "layout");
}

function fail<T = undefined>(message: string): ActionResult<T> {
  return { success: false, message };
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Ids end up in URLs and in customers' saved carts, so they're generated
// once from the title and never change afterwards.
async function uniqueId(table: "paintings" | "tarot_cards", title: string): Promise<string> {
  const base = slugify(title) || "piece";
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .select("id")
    .like("id", `${base}%`);
  if (error) throw new Error(error.message);

  const taken = new Set((data ?? []).map((row: { id: string }) => row.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

// Only two kinds of image value are ever accepted: files uploaded to our
// own Supabase bucket, or the original images that ship in /public.
function isAllowedImage(url: string): boolean {
  if (/^\/(paintings|tarot|tarot-thumbs)\/[^/]+$/.test(url)) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base) && url.startsWith(`${base}/storage/v1/object/public/${ART_BUCKET}/`);
}

async function removeStoredImages(urls: (string | null | undefined)[]) {
  const paths = urls
    .map((u) => storagePathFromUrl(u))
    .filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  // Best effort: a leftover file costs a few KB, a failed delete shouldn't
  // block the actual change.
  await getSupabaseAdmin().storage.from(ART_BUCKET).remove(paths);
}

// New pieces go to the top of the site's lists.
async function topSortOrder(table: "paintings" | "tarot_cards"): Promise<number> {
  const { data } = await getSupabaseAdmin()
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1);
  const lowest = data?.[0]?.sort_order;
  return typeof lowest === "number" ? lowest - 10 : 0;
}

async function moveRow(
  table: "paintings" | "tarot_cards",
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return fail(error.message);

  const ids = (data ?? []).map((row: { id: string }) => row.id);
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= ids.length) {
    return { success: true, message: "Already at the edge." };
  }

  [ids[from], ids[to]] = [ids[to], ids[from]];

  // Renumber everything in steps of 10 so the order is always clean.
  const results = await Promise.all(
    ids.map((rowId, index) =>
      supabase.from(table).update({ sort_order: (index + 1) * 10 }).eq("id", rowId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(failed.error.message);

  revalidateSite();
  return { success: true, message: "Moved." };
}

// ─── Session ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}

// ─── Image uploads ───────────────────────────────────────────────────────

// Images go straight from the browser to Supabase Storage — Vercel caps
// request bodies at ~4.5 MB, far too small for art scans, so they can't
// pass through our own server. This action just hands out a one-time
// upload link, and only to a logged-in admin.
export async function createImageUpload(
  folder: "paintings" | "tarot",
  fileName: string,
): Promise<ActionResult<{ path: string; token: string; publicUrl: string }>> {
  await requireAdminAction();

  if (folder !== "paintings" && folder !== "tarot") return fail("Invalid folder.");

  const ext = fileName.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  if (!ext) return fail("Please upload a JPG, PNG or WebP image.");

  const baseName = slugify(fileName.replace(/\.[^.]+$/, "")) || "image";
  const random = crypto.randomUUID().slice(0, 8);
  const path = `${folder}/${Date.now()}-${random}-${baseName}.${ext === "jpeg" ? "jpg" : ext}`;

  const storage = getSupabaseAdmin().storage.from(ART_BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error || !data) return fail(`Couldn't start the upload: ${error?.message ?? "unknown error"}`);

  const publicUrl = storage.getPublicUrl(path).data.publicUrl;
  return { success: true, message: "Ready to upload.", data: { path, token: data.token, publicUrl } };
}

// ─── Paintings ───────────────────────────────────────────────────────────

export interface PaintingInput {
  id?: string; // present when editing
  title: string;
  image: string;
  medium: string;
  size: string;
  year: string;
  price: number;
  available: boolean;
  featured: boolean;
  originalForSale: boolean;
  wide: boolean;
  // null = use the site-wide A4/A5 defaults.
  printSizes: { id?: string; label: string; dims: string; price: number }[] | null;
}

function cleanPrintSizes(
  sizes: PaintingInput["printSizes"],
): { ok: true; value: { id: string; label: string; dims: string; price: number }[] | null } | { ok: false; message: string } {
  if (sizes === null) return { ok: true, value: null };
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return { ok: false, message: "Add at least one print size, or switch back to the standard sizes." };
  }
  if (sizes.length > 10) return { ok: false, message: "That's a lot of sizes — 10 at most." };

  const used = new Set<string>();
  const cleaned = [];
  for (const size of sizes) {
    const label = String(size.label ?? "").trim().slice(0, 40);
    const dims = String(size.dims ?? "").trim().slice(0, 60);
    const price = Number(size.price);
    if (!label) return { ok: false, message: "Every print size needs a name (e.g. A4)." };
    if (!Number.isFinite(price) || price <= 0) {
      return { ok: false, message: `Print size "${label}" needs a price above 0.` };
    }
    // Keep existing ids stable (they're stored in customers' carts); make
    // one from the name for new rows.
    let id = String(size.id ?? "").trim() || slugify(label) || "size";
    while (used.has(id)) id = `${id}-2`;
    used.add(id);
    cleaned.push({ id, label, dims, price: Math.round(price * 100) / 100 });
  }
  return { ok: true, value: cleaned };
}

export async function savePainting(input: PaintingInput): Promise<ActionResult<{ id: string }>> {
  await requireAdminAction();

  const title = String(input.title ?? "").trim().slice(0, 200);
  const image = String(input.image ?? "").trim();
  const price = Number(input.price);

  if (!title) return fail("Give the painting a title.");
  if (!image) return fail("Add an image of the painting.");
  if (!isAllowedImage(image)) return fail("That image link isn't allowed — please upload the file.");
  if (!Number.isFinite(price) || price < 0) return fail("The original's price must be a number (0 or more).");

  const sizes = cleanPrintSizes(input.printSizes);
  if (!sizes.ok) return fail(sizes.message);

  const row = {
    title,
    image,
    medium: String(input.medium ?? "").trim().slice(0, 100) || "Ink on paper",
    size: String(input.size ?? "").trim().slice(0, 60),
    year: String(input.year ?? "").trim().slice(0, 10),
    price: Math.round(price * 100) / 100,
    available: Boolean(input.available),
    featured: Boolean(input.featured),
    original_for_sale: Boolean(input.originalForSale),
    wide: Boolean(input.wide),
    print_sizes: sizes.value,
  };

  const supabase = getSupabaseAdmin();

  try {
    if (input.id) {
      const { data: existing, error: readError } = await supabase
        .from("paintings")
        .select("image")
        .eq("id", input.id)
        .maybeSingle();
      if (readError) return fail(readError.message);
      if (!existing) return fail("That painting no longer exists.");

      const { error } = await supabase.from("paintings").update(row).eq("id", input.id);
      if (error) return fail(error.message);

      if (existing.image !== image) await removeStoredImages([existing.image]);

      revalidateSite();
      return { success: true, message: "Saved.", data: { id: input.id } };
    }

    const id = await uniqueId("paintings", title);
    const { error } = await supabase
      .from("paintings")
      .insert({ ...row, id, sort_order: await topSortOrder("paintings") });
    if (error) return fail(error.message);

    revalidateSite();
    return { success: true, message: "Painting added.", data: { id } };
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Something went wrong while saving.");
  }
}

export async function deletePainting(id: string): Promise<ActionResult> {
  await requireAdminAction();

  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from("paintings")
    .select("image")
    .eq("id", id)
    .maybeSingle();
  if (readError) return fail(readError.message);
  if (!existing) return fail("That painting no longer exists.");

  const { error } = await supabase.from("paintings").delete().eq("id", id);
  if (error) return fail(error.message);

  await removeStoredImages([existing.image]);
  revalidateSite();
  return { success: true, message: "Deleted." };
}

export async function movePainting(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdminAction();
  return moveRow("paintings", id, direction === "up" ? "up" : "down");
}

// ─── Tarot cards ─────────────────────────────────────────────────────────

export interface TarotInput {
  id?: string; // present when editing
  title: string;
  image: string; // framed card
  previewImage: string | null; // sketch (optional)
}

export async function saveTarotCard(input: TarotInput): Promise<ActionResult<{ id: string }>> {
  await requireAdminAction();

  const title = String(input.title ?? "").trim().slice(0, 200);
  const image = String(input.image ?? "").trim();
  const previewImage = input.previewImage ? String(input.previewImage).trim() : null;

  if (!title) return fail("Give the card a title.");
  if (!image) return fail("Add the framed card image.");
  if (!isAllowedImage(image)) return fail("That image link isn't allowed — please upload the file.");
  if (previewImage && !isAllowedImage(previewImage)) {
    return fail("That sketch image link isn't allowed — please upload the file.");
  }

  const supabase = getSupabaseAdmin();

  try {
    if (input.id) {
      const { data: existing, error: readError } = await supabase
        .from("tarot_cards")
        .select("image, preview_image, image_thumb, preview_image_thumb")
        .eq("id", input.id)
        .maybeSingle();
      if (readError) return fail(readError.message);
      if (!existing) return fail("That card no longer exists.");

      const imageChanged = existing.image !== image;
      const previewChanged = existing.preview_image !== previewImage;

      const { error } = await supabase
        .from("tarot_cards")
        .update({
          title,
          image,
          preview_image: previewImage,
          // A dedicated thumbnail only matches the image it was made from.
          image_thumb: imageChanged ? null : existing.image_thumb,
          preview_image_thumb: previewChanged ? null : existing.preview_image_thumb,
        })
        .eq("id", input.id);
      if (error) return fail(error.message);

      await removeStoredImages([
        imageChanged ? existing.image : null,
        previewChanged ? existing.preview_image : null,
      ]);

      revalidateSite();
      return { success: true, message: "Saved.", data: { id: input.id } };
    }

    const id = await uniqueId("tarot_cards", title);
    const { error } = await supabase.from("tarot_cards").insert({
      id,
      title,
      image,
      preview_image: previewImage,
      sort_order: await topSortOrder("tarot_cards"),
    });
    if (error) return fail(error.message);

    revalidateSite();
    return { success: true, message: "Card added.", data: { id } };
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Something went wrong while saving.");
  }
}

export async function deleteTarotCard(id: string): Promise<ActionResult> {
  await requireAdminAction();

  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .from("tarot_cards")
    .select("image, preview_image")
    .eq("id", id)
    .maybeSingle();
  if (readError) return fail(readError.message);
  if (!existing) return fail("That card no longer exists.");

  const { error } = await supabase.from("tarot_cards").delete().eq("id", id);
  if (error) return fail(error.message);

  await removeStoredImages([existing.image, existing.preview_image]);
  revalidateSite();
  return { success: true, message: "Deleted." };
}

export async function moveTarotCard(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdminAction();
  return moveRow("tarot_cards", id, direction === "up" ? "up" : "down");
}
