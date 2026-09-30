// Types and pure helpers for paintings — no database code in here, so it's
// safe to import from client components (the Works gallery, the admin
// forms) without dragging the Supabase server client into the browser.

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
  // Shown at double width in the gallery grids.
  wide?: boolean;
  // Overrides the site-wide default A4/A5 print sizes/prices for this
  // specific painting. Falls back to the global defaults in
  // lib/pricing.ts when omitted or empty.
  printSizes?: PrintSizeOverride[];
}

// Derives a width/height ratio from the physical size we already print on
// the plaque (e.g. "20.9 × 23 cm" or "29.7 x 42 cm"), so <Image> can be
// given accurate intrinsic dimensions for a piece without needing to open
// the actual file. Used only as a layout/aspect-ratio hint — the browser
// still renders each image at its own real dimensions once it loads, so a
// slightly-off guess here never crops or distorts anything on screen.
const FALLBACK_RATIO = 0.8;

export function getPaintingAspectRatio(painting: Pick<Painting, "size">): number {
  const match = painting.size?.match(/(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return FALLBACK_RATIO;
  const width = parseFloat(match[1]);
  const height = parseFloat(match[2]);
  if (!width || !height) return FALLBACK_RATIO;
  return width / height;
}
