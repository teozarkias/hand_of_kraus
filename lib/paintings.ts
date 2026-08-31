export interface PrintSizeOverride {
  id: string;
  label: string;
  dims: string;
  price: number;
}

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
  // Overrides the site-wide default A4/A5 print sizes/prices for this
  // specific painting — some pieces print at non-standard dimensions or
  // need their own pricing. Falls back to the global defaults in
  // lib/pricing.ts when omitted.
  printSizes?: PrintSizeOverride[];
}

export const paintings: Painting[] = [
  {
    id: "the-upper-plains",
    title: "The Upper Plains",
    image: "/paintings/The_Upper_Plains.jpg",
    medium: "Ink on paper",
    size: "20.9 × 23 cm",
    year: "2026",
    price: 500,
    available: true,
    printSizes: [
      { id: "a4", label: "Large", dims: "29.6 × 32.5 cm", price: 20 },
      { id: "a5", label: "Small", dims: "20.9 × 23 cm", price: 10 },
    ],
  },
  {
    id: "dead-sea",
    title: "Dead Sea",
    image: "/paintings/Dead_Sea.jpg",
    medium: "Ink on paper",
    size: "29.7 x 42 cm",
    year: "2026",
    price: 1200,
    available: true,
    printSizes: [
      { id: "a4", label: "A4", dims: "21 × 29.7 cm", price: 20 },
      { id: "a3", label: "A3", dims: "29.7 × 42 cm", price: 35 },
    ],
  },
  {
    id: "items-ii",
    title: "ITEMS I",
    image: "/paintings/ITEMS-II.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 700,
    available: true,
    featured: true,
  },
  {
    id: "lost-sanctuary",
    title: "Lost Sanctuary",
    image: "/paintings/Lost_sanctuary.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 750,
    available: true,
  },
  {
    id: "requiem",
    title: "Requiem",
    image: "/paintings/Requiem.jpg",
    medium: "Ink on paper",
    size: "14.7 × 14.7 cm",
    year: "2026",
    price: 400,
    available: true,
    printSizes: [
      { id: "large", label: "Large", dims: "20.8 × 20.8 cm", price: 20 },
      { id: "small", label: "Small", dims: "14.7 × 14.7 cm", price: 10 },
    ],
  },
  {
    id: "immortality",
    title: "Immortality",
    image: "/paintings/Immortality.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 800,
    available: true,
  },
  {
    id: "kingdom",
    title: "Kingdom",
    image: "/paintings/Kingdom.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 700,
    available: true,
  },
  {
    id: "items",
    title: "ITEMS II",
    image: "/paintings/ITEMS.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 700,
    available: true,
  },
  {
    id: "killers-of-the-southern-oracle",
    title: "Killers of the Southern Oracle",
    image: "/paintings/killers_of_the_southern_oracle.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 500,
    available: true,
    featured: true,
  },
  {
    id: "whatever-happened-to-the-dragonmaker",
    title: "Whatever happened to the Dragonmaker?",
    image: "/paintings/wtv-happened-to-dragonmaker.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2026",
    price: 650,
    available: true,
  },
  {
    id: "hymn-for-the-mother-of-tears",
    title: "Hymn for the Mother of Tears",
    image: "/paintings/hymn_for_the_mother_of_tears.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2025",
    price: 500,
    available: true,
  },
  {
    id: "vessels",
    title: "Vessels II",
    image: "/paintings/VESSELS_1.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2025",
    price: 650,
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
    title: "Vessels I",
    image: "/paintings/VESSELS.jpg",
    medium: "Ink on paper",
    size: "21 × 29.7 cm",
    year: "2025",
    price: 650,
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
