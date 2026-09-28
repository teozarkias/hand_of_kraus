export interface TarotCard {
  id: string;
  title: string;
  price: number;

  // Full-quality versions — used on the actual buy page, where the zoom
  // feature needs real detail to be worth anything.
  image: string;
  previewImage?: string;

  // Optimized/small versions — used only in the gallery grid and its
  // hover-reveal, where speed matters more than maximum resolution.
  imageThumb: string;
  previewImageThumb?: string;
}

const DEFAULT_PRICE = 35;

// Builds both the full-quality and thumbnail paths for a card from a
// single filename, so each pair only needs to be listed once below.
function makeCard(
  id: string,
  title: string,
  framedFilename: string,
  sketchFilename?: string,
): TarotCard {
  return {
    id,
    title,
    price: DEFAULT_PRICE,
    image: `/tarot/${framedFilename}`,
    imageThumb: `/tarot-thumbs/${framedFilename}`,
    previewImage: sketchFilename ? `/tarot/${sketchFilename}` : undefined,
    previewImageThumb: sketchFilename
      ? `/tarot-thumbs/${sketchFilename}`
      : undefined,
  };
}

// Same as makeCard, but for cards that don't have matching files in
// public/tarot-thumbs yet — the grid thumbnail points straight at the
// full-size file instead, and next/image resizes it down on the fly (the
// same way the paintings gallery already works, since it never had a
// thumbs folder at all). Swap a card over to makeCard() once real thumbs
// exist for it.
function makeCardNoThumbs(
  id: string,
  title: string,
  framedFilename: string,
  sketchFilename: string,
): TarotCard {
  return {
    id,
    title,
    price: DEFAULT_PRICE,
    image: `/tarot/${framedFilename}`,
    imageThumb: `/tarot/${framedFilename}`,
    previewImage: `/tarot/${sketchFilename}`,
    previewImageThumb: `/tarot/${sketchFilename}`,
  };
}

export const tarotCards: TarotCard[] = [
  // Lovers — confirmed pairing from the artist's screenshot.
  makeCard("the-lovers", "The Lovers", "LOVERS2.jpg", "The_Lovers.jpg"),
  makeCard("the-lovers-ii", "The Lovers?", "LOVERS1.jpg", "The_Lovers2.jpg"),

  // Magician — grouped by title, but no filename-casing signal exists to
  // confirm which file is the sketch vs. the framed card. Best guess.
  makeCard(
    "the-magician-ii",
    "The Magician",
    "The_Magician4.jpg",
    "The_Magician.jpg",
  ),

  makeCard(
    "the-magician",
    "The Magician?",
    "The_Magician3.jpg",
    "The_Magician2.jpg",
  ),

  // Sun — same casing pattern as Lovers.
  makeCard("the-sun-ii", "The Sun", "THE_SUN_1.jpg", "The_Sun.jpg"),
  makeCard("the-sun", "The Sun?", "THE_SUN_2.jpg", "The_Sun2.jpg"),

  // Tower — same casing pattern.
  makeCard("the-tower", "The Tower", "TOWER2.jpg", "The_Tower.jpg"),
  makeCard("the-tower-ii", "The Tower?", "TOWER1.jpg", "The_Tower2.jpg"),

  // Emperor — confirmed framed/sketch pairing (unlike Magician above, no
  // guessing here). No tarot-thumbs files yet, so these use
  // makeCardNoThumbs until real thumbnails are added.
  makeCardNoThumbs(
    "the-emperor",
    "The Emperor",
    "the_emperor.jpg",
    "the_emperor1.jpg",
  ),
  makeCardNoThumbs(
    "the-emperor-ii",
    "The Emperor?",
    "the_emperor2.jpg",
    "the_emperor3.jpg",
  ),
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
