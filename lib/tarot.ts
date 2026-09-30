import { cache } from "react";
import { getSupabaseAdmin } from "./supabase";

export interface TarotCard {
  id: string;
  title: string;
  price: number;

  // Full-quality versions — used on the actual buy page, where the zoom
  // feature needs real detail to be worth anything.
  image: string;
  previewImage?: string;

  // Small versions for the gallery grid and its hover-reveal. Only the
  // original cards have dedicated files in /public/tarot-thumbs; for
  // everything else these are the full image, and next/image shrinks it.
  imageThumb: string;
  previewImageThumb?: string;
}

// Tarot cards used to be a hardcoded list in this file; they now live in
// the Supabase `tarot_cards` table, managed from /admin. Every function
// here runs on the server only.

interface TarotRow {
  id: string;
  title: string;
  price: number | string;
  image: string;
  preview_image: string | null;
  image_thumb: string | null;
  preview_image_thumb: string | null;
  sort_order: number;
}

function toTarotCard(row: TarotRow): TarotCard {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    image: row.image,
    previewImage: row.preview_image ?? undefined,
    imageThumb: row.image_thumb ?? row.image,
    previewImageThumb: row.preview_image
      ? (row.preview_image_thumb ?? row.preview_image)
      : undefined,
  };
}

export const getAllTarotCards = cache(async function getAllTarotCards(): Promise<TarotCard[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("tarot_cards")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Couldn't load tarot cards: ${error.message}`);
  return (data as TarotRow[]).map(toTarotCard);
});

export const getTarotCardById = cache(async function getTarotCardById(
  id: string,
): Promise<TarotCard | undefined> {
  const { data, error } = await getSupabaseAdmin()
    .from("tarot_cards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Couldn't load tarot card "${id}": ${error.message}`);
  return data ? toTarotCard(data as TarotRow) : undefined;
});

export async function getAllTarotIds(): Promise<string[]> {
  return (await getAllTarotCards()).map((c) => c.id);
}
