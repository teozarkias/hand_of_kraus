import { getPaintingById } from "./paintings";
import { getTarotCardById } from "./tarot";
import { getPrintSize } from "./pricing";
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
// our own data files — title, price, and image never come from whatever
// the browser happens to send.
export function resolveCartItem(item: CartItem): ResolvedCartItem | null {
  const product =
    item.kind === "tarot"
      ? getTarotCardById(item.paintingId)
      : getPaintingById(item.paintingId);

  if (!product) return null;

  const price =
    item.kind === "print" || item.kind === "tarot"
      ? getPrintSize(item.size!).price
      : product.price;

  const href =
    item.kind === "original"
      ? `/shop/originals/${product.id}`
      : item.kind === "print"
        ? `/shop/prints/${product.id}`
        : `/shop/tarot/${product.id}`;

  const meta =
    item.kind === "original"
      ? `Original${"medium" in product ? ` · ${product.medium}` : ""}`
      : item.kind === "print"
        ? `Print · ${getPrintSize(item.size!).label}`
        : `Tarot card · ${getPrintSize(item.size!).label}`;

  // Tarot cards have separate full/thumb fields; paintings only have one.
  const image = "imageThumb" in product ? product.imageThumb : product.image;

  return { id: product.id, title: product.title, image, price, meta, href };
}
