import { cache } from "react";
import { getSupabaseAdmin } from "./supabase";
import type { Painting, PrintSizeOverride } from "./painting-utils";

// Re-exported so existing `import { ... } from "@/lib/paintings"` lines
// keep working. Client components should import these from
// "@/lib/painting-utils" instead, so they don't pull in the database code.
export type { Painting, PrintSizeOverride } from "./painting-utils";
export { getPaintingAspectRatio } from "./painting-utils";

// Paintings used to be a hardcoded array in this file; they now live in the
// Supabase `paintings` table, managed from /admin. Every function here
// runs on the server only.

interface PaintingRow {
  id: string;
  title: string;
  image: string;
  medium: string;
  size: string;
  year: string;
  price: number | string;
  available: boolean;
  featured: boolean;
  original_for_sale: boolean;
  wide: boolean;
  print_sizes: PrintSizeOverride[] | null;
  sort_order: number;
}

function toPainting(row: PaintingRow): Painting {
  return {
    id: row.id,
    title: row.title,
    image: row.image,
    medium: row.medium,
    size: row.size,
    year: row.year,
    // Postgres numeric comes back as a string from the API.
    price: Number(row.price),
    available: row.available,
    featured: row.featured,
    originalForSale: row.original_for_sale,
    wide: row.wide,
    printSizes:
      row.print_sizes && row.print_sizes.length > 0
        ? row.print_sizes.map((s) => ({ ...s, price: Number(s.price) }))
        : undefined,
  };
}

// cache() dedupes identical calls within a single request (e.g. a page and
// its generateStaticParams/metadata both asking for the same list), so the
// database is hit once per render, not once per caller.
export const getAllPaintings = cache(async function getAllPaintings(): Promise<Painting[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("paintings")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Couldn't load paintings: ${error.message}`);
  return (data as PaintingRow[]).map(toPainting);
});

export const getPaintingById = cache(async function getPaintingById(
  id: string,
): Promise<Painting | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("paintings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Couldn't load painting "${id}": ${error.message}`);
  return data ? toPainting(data as PaintingRow) : undefined;
});

export async function getAllPaintingIds(): Promise<string[]> {
  return (await getAllPaintings()).map((p) => p.id);
}

export async function getFeaturedPaintings(): Promise<Painting[]> {
  return (await getAllPaintings()).filter((p) => p.featured);
}

export async function getOriginalsForSale(): Promise<Painting[]> {
  return (await getAllPaintings()).filter((p) => p.originalForSale !== false);
}
