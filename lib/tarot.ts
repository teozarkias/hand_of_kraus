export interface TarotCard {
  id: string;
  title: string;
  image: string;
}

// Preview art for the tarot deck in progress. These are not sold
// individually — the deck is one product, sold as a whole once complete
// (see app/shop/tarot/page.tsx).
export const tarotCards: TarotCard[] = [
  { id: "the-lovers", title: "The Lovers", image: "/tarot/LOVERS1.jpg" },
  { id: "the-lovers-ii", title: "The Lovers II", image: "/tarot/LOVERS2.jpg" },
  {
    id: "the-lovers-iii",
    title: "The Lovers III",
    image: "/tarot/The_Lovers.jpg",
  },
  {
    id: "the-lovers-iv",
    title: "The Lovers IV",
    image: "/tarot/The_Lovers2.jpg",
  },
  {
    id: "the-magician",
    title: "The Magician",
    image: "/tarot/The_Magician.jpg",
  },
  {
    id: "the-magician-ii",
    title: "The Magician II",
    image: "/tarot/The_Magician2.jpg",
  },
  {
    id: "the-magician-iii",
    title: "The Magician III",
    image: "/tarot/The_Magician3.jpg",
  },
  {
    id: "the-magician-iv",
    title: "The Magician IV",
    image: "/tarot/The_Magician4.jpg",
  },
  { id: "the-sun", title: "The Sun", image: "/tarot/THE_SUN_1.jpg" },
  { id: "the-sun-ii", title: "The Sun II", image: "/tarot/THE_SUN_2.jpg" },
  { id: "the-sun-iii", title: "The Sun III", image: "/tarot/The_Sun.jpg" },
  { id: "the-sun-iv", title: "The Sun IV", image: "/tarot/The_Sun2.jpg" },
  { id: "the-tower", title: "The Tower", image: "/tarot/The_Tower.jpg" },
  { id: "the-tower-ii", title: "The Tower II", image: "/tarot/The_Tower2.jpg" },
  { id: "the-tower-iii", title: "The Tower III", image: "/tarot/TOWER1.jpg" },
  { id: "the-tower-iv", title: "The Tower IV", image: "/tarot/TOWER2.jpg" },
  {
    id: "tarot-animals",
    title: "Tarot Animals",
    image: "/tarot/Tarot_Animals.jpg",
  },
];

export function getAllTarotCards(): TarotCard[] {
  return tarotCards;
}
