export interface TarotCard {
  id: string;
  title: string;
  image: string;
  price: number;
}

// Flat default price for a single tarot card. Adjust per-card below if some
// should cost differently later.
const DEFAULT_PRICE = 35;

// Preview art for the tarot deck in progress. Individual cards can now be
// bought on their own (see app/shop/tarot/[id]/page.tsx) even while the
// full 78-card deck is still being finished.
export const tarotCards: TarotCard[] = [
  {
    id: "the-lovers",
    title: "The Lovers",
    image: "/tarot/LOVERS1.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-lovers-ii",
    title: "The Lovers II",
    image: "/tarot/LOVERS2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-lovers-iii",
    title: "The Lovers III",
    image: "/tarot/The_Lovers.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-lovers-iv",
    title: "The Lovers IV",
    image: "/tarot/The_Lovers2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-magician",
    title: "The Magician",
    image: "/tarot/The_Magician.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-magician-ii",
    title: "The Magician II",
    image: "/tarot/The_Magician2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-magician-iii",
    title: "The Magician III",
    image: "/tarot/The_Magician3.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-magician-iv",
    title: "The Magician IV",
    image: "/tarot/The_Magician4.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-sun",
    title: "The Sun",
    image: "/tarot/THE_SUN_1.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-sun-ii",
    title: "The Sun II",
    image: "/tarot/THE_SUN_2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-sun-iii",
    title: "The Sun III",
    image: "/tarot/The_Sun.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-sun-iv",
    title: "The Sun IV",
    image: "/tarot/The_Sun2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-tower",
    title: "The Tower",
    image: "/tarot/The_Tower.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-tower-ii",
    title: "The Tower II",
    image: "/tarot/The_Tower2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-tower-iii",
    title: "The Tower III",
    image: "/tarot/TOWER1.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "the-tower-iv",
    title: "The Tower IV",
    image: "/tarot/TOWER2.jpg",
    price: DEFAULT_PRICE,
  },
  {
    id: "tarot-animals",
    title: "Tarot Animals",
    image: "/tarot/Tarot_Animals.jpg",
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
