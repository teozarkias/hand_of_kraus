"use server";

import { resolveCartItem, type ResolvedCartItem } from "@/lib/cart-pricing";
import type { CartItem } from "@/lib/CartContext";

export interface ResolvedCartRow extends ResolvedCartItem {
  // Position in the stored cart, so "Remove" deletes the right entry even
  // when some items were dropped (e.g. a painting that's since been sold).
  index: number;
}

// The cart itself lives in the browser (localStorage), but the catalogue
// lives in the database — so the cart page asks the server to turn its
// stored ids into real titles/prices/images. Anything that no longer
// exists or is no longer for sale is left out.
export async function resolveCart(items: CartItem[]): Promise<ResolvedCartRow[]> {
  if (!Array.isArray(items) || items.length === 0) return [];

  // Cap it — nobody has 100 artworks in a cart, and this stops a bogus
  // request from making the server do unbounded lookups.
  const capped = items.slice(0, 100);

  const resolved = await Promise.all(capped.map((item) => resolveCartItem(item)));

  return resolved.flatMap((row, index) => (row ? [{ ...row, index }] : []));
}
