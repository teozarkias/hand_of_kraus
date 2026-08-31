import { PRINT_SIZES } from "./pricing";

export interface ResolvedPrintSize {
  id: string;
  label: string;
  dims: string;
  price: number;
}

// Anything with an optional printSizes field can use this — both the
// full Painting type and ProductDetail's lighter DetailItem shape.
interface HasOptionalPrintSizes {
  printSizes?: ResolvedPrintSize[];
}

export function getPrintSizesFor(
  item: HasOptionalPrintSizes,
): ResolvedPrintSize[] {
  if (item.printSizes && item.printSizes.length > 0) {
    return item.printSizes;
  }
  return PRINT_SIZES.map((s) => ({
    id: s.id,
    label: s.label,
    dims: s.dims,
    price: s.price,
  }));
}

export function getPrintSizeFor(
  item: HasOptionalPrintSizes,
  sizeId: string,
): ResolvedPrintSize | undefined {
  return getPrintSizesFor(item).find((s) => s.id === sizeId);
}
