export const PRINT_SIZES = [
  { id: "a4", label: "A4", dims: "21 × 29.7 cm", price: 45 },
  { id: "a5", label: "A5", dims: "14.8 × 21 cm", price: 30 },
] as const;

export type PrintSizeId = (typeof PRINT_SIZES)[number]["id"];

export function getPrintSize(id: PrintSizeId) {
  return PRINT_SIZES.find((s) => s.id === id)!;
}
