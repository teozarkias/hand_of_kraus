export interface Painting {
  id: string;
  title: string;
  image: string;
  medium: string;
  size: string;
  year: string;
  price: number;
  available: boolean;
  featured?: boolean;
  // Some pieces can't be sold as the physical one-of-one original (the
  // artist wants to keep them, license restrictions, etc.) but should
  // still be sellable as prints. Defaults to true when omitted.
  originalForSale?: boolean;
}

export const paintings: Painting[] = [
  {
    id: "items-ii",
    title: "ITEMS II",
    image: "/paintings/ITEMS-II.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
    featured: true,
  },
  {
    id: "lost-sanctuary",
    title: "Lost sanctuary",
    image: "/paintings/Lost_sanctuary.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "requiem",
    title: "Requiem",
    image: "/paintings/Requiem.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "immortality",
    title: "Immortality",
    image: "/paintings/Immortality.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "kingdom",
    title: "Kingdom",
    image: "/paintings/Kingdom.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "items",
    title: "ITEMS",
    image: "/paintings/ITEMS.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "killers-of-the-southern-oracle",
    title: "Killers of the Southern Oracle",
    image: "/paintings/killers_of_the_southern_oracle.jpg",
    medium: "Ink on paper",
    size: "50 × 70 cm",
    year: "2026",
    price: 640,
    available: true,
    featured: true,
  },
  {
    id: "whatever-happened-to-the-dragonmaker",
    title: "Whatever happened to the Dragonmaker?",
    image: "/paintings/wtv-happened-to-dragonmaker.jpg",
    medium: "Ink on paper",
    size: "40 × 56 cm",
    year: "2024",
    price: 560,
    available: true,
  },
  {
    id: "hymn-for-the-mother-of-tears",
    title: "Hymn for the Mother of Tears",
    image: "/paintings/hymn_for_the_mother_of_tears.jpg",
    medium: "Ink on paper",
    size: "45 × 62 cm",
    year: "2025",
    price: 690,
    available: true,
  },
  {
    id: "vessels",
    title: "VESSELS II",
    image: "/paintings/VESSELS_1.jpg",
    medium: "Ink on paper",
    size: "42 × 59 cm",
    year: "2025",
    price: 520,
    available: true,
  },
  {
    id: "grave-of-mensis",
    title: "Grave of Mensis",
    image: "/paintings/grave_of_mensis.jpg",
    medium: "Ink on paper",
    size: "50 × 70 cm",
    year: "2024",
    price: 710,
    available: true,
    featured: true,
    originalForSale: false,
  },
  {
    id: "the_witch_of_Rothwood",
    title: "The witch of Rothwood",
    image: "/paintings/The_witch_of_Rothwood.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
    originalForSale: false,
  },
  {
    id: "VESSELS",
    title: "VESSELS",
    image: "/paintings/VESSELS.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
  },
  {
    id: "forbidden_cave",
    title: "Forbidden cave",
    image: "/paintings/Forbidden_cave.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
    originalForSale: false,
  },
  {
    id: "i-shall-remain",
    title: "I Shall Remain",
    image: "/paintings/I_shall_remain.jpg",
    medium: "Ink on paper",
    size: "48 × 65 cm",
    year: "2025",
    price: 780,
    available: true,
    originalForSale: false,
  },
];

export function getPaintingById(id: string): Painting | undefined {
  return paintings.find((p) => p.id === id);
}

export function getAllPaintingIds(): string[] {
  return paintings.map((p) => p.id);
}

export function getFeaturedPaintings(): Painting[] {
  return paintings.filter((p) => p.featured);
}

export function getOriginalsForSale(): Painting[] {
  return paintings.filter((p) => p.originalForSale !== false);
}
