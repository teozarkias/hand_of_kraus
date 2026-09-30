import { getPaintingById } from "./paintings";
import { getTarotCardById } from "./tarot";
import { getPrintSize } from "./pricing";
import { getPrintSizeFor } from "./print-sizes";
import type { CartItem } from "./CartContext";

export interface ResolvedCartItem {
  id: string;
  title: string;
  image: string;
  price: number; // EUR, whole units (not cents)
  meta: string;
  href: string;
}

// Turns a stored CartItem (just an id + kind + optional size) into real,
// trustworthy display/checkout data by looking everything up fresh from
// the database — title, price, and image never come from whatever the
// browser happens to send. Server-only (it reads from Supabase).
export async function resolveCartItem(
  item: CartItem,
): Promise<ResolvedCartItem | null> {
  // Handled as two separate branches (rather than one shared lookup) so
  // TypeScript narrows `product`/`card` to a concrete type in each one —
  // TarotCard has no printSizes field at all, so passing the wider
  // Painting | TarotCard union into a Painting-only helper doesn't type-check.
  if (item.kind === "tarot") {
    const card = await getTarotCardById(item.paintingId);
    if (!card) return null;

    const printSize = getPrintSize(item.size ?? "");
    const price = printSize ? printSize.price : card.price;

    return {
      id: card.id,
      title: card.title,
      image: card.imageThumb,
      price,
      meta: `Tarot card · ${printSize?.label ?? item.size ?? ""}`,
      href: `/shop/tarot/${card.id}`,
    };
  }

  const painting = await getPaintingById(item.paintingId);
  if (!painting) return null;

  // An original that's been marked sold (or not-for-sale) in the admin
  // panel since it was added to someone's cart can't be bought anymore.
  if (
    item.kind === "original" &&
    (!painting.available || painting.originalForSale === false)
  ) {
    return null;
  }

  const printSize =
    item.kind === "print"
      ? getPrintSizeFor(painting, item.size ?? "")
      : undefined;
  const price = printSize ? printSize.price : painting.price;

  const href =
    item.kind === "original"
      ? `/shop/originals/${painting.id}`
      : `/shop/prints/${painting.id}`;

  const meta =
    item.kind === "original"
      ? `Original · ${painting.medium}`
      : `Print · ${printSize?.label ?? item.size ?? ""}`;

  return {
    id: painting.id,
    title: painting.title,
    image: painting.image,
    price,
    meta,
    href,
  };
}
