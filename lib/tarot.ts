export interface TarotCard {
  id: string;
  title: string;
  image: string; // the finished, framed card — also what's sold on the product page
  previewImage?: string; // raw preview sketch, shown by default in the gallery; hover reveals `image`
  price: number;
}

// Flat default price for a single tarot card. Adjust per-card below if some
// should cost differently later.
const DEFAULT_PRICE = 35;

export const tarotCards: TarotCard[] = [
  // Lovers — confirmed from screenshot: two distinct finished designs,
  // each with a raw preview + the framed card.
  {
    id: "the-lovers",
    title: "The Lovers",
    previewImage: "/tarot/The_Lovers.jpg",
    image: "/tarot/LOVERS2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-lovers-ii",
    title: "The Lovers?",
    previewImage: "/tarot/The_Lovers2.jpg",
    image: "/tarot/LOVERS1.jpg",
    price: DEFAULT_PRICE,
  },

  // Magician — grouped by title, but no all-caps filename exists for this
  // one to signal which file is the raw sketch vs. the framed card, so
  // this pairing is a GUESS. If it's backwards, just swap previewImage
  // and image on either entry below.
  {
    id: "the-magician",
    title: "The Magician",
    previewImage: "/tarot/The_Magician2.jpg",
    image: "/tarot/The_Magician3.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-magician-ii",
    title: "The Magician?",
    previewImage: "/tarot/The_Magician.jpg",
    image: "/tarot/The_Magician4.jpg",
    price: DEFAULT_PRICE,
  },

  // Sun — same casing pattern as Lovers (The_... = raw, ALL-CAPS = framed).
  {
    id: "the-sun",
    title: "The Sun",
    previewImage: "/tarot/The_Sun2.jpg",
    image: "/tarot/THE_SUN_2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-sun-ii",
    title: "The Sun?",
    previewImage: "/tarot/The_Sun.jpg",
    image: "/tarot/THE_SUN_1.jpg",
    price: DEFAULT_PRICE,
  },

  // Tower — same casing pattern.
  {
    id: "the-tower",
    title: "The Tower",
    previewImage: "/tarot/The_Tower2.jpg",
    image: "/tarot/TOWER1.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-tower-ii",
    title: "The Tower?",
    previewImage: "/tarot/The_Tower.jpg",
    image: "/tarot/TOWER2.jpg",
    price: DEFAULT_PRICE,
  },
];

export function getAllTarotCards(): TarotCard[] {
  return tarotCards;
}

export function getTarotCardById(id: string): TarotCard | undefined {
  return tarotCards.find((c) => c.id === id);
}

export function getAllTarotIds(): string[] {
  return tarotCards.map((c) => c.id);
}
