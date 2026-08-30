export const SHIPPING_ZONES = [
  {
    id: "greece",
    label: "Greece",
    price: 4,
    minDays: 1,
    maxDays: 3,
  },
  {
    id: "europe",
    label: "Europe",
    price: 6.9,
    minDays: 4,
    maxDays: 8,
  },
  {
    id: "us_ca",
    label: "USA & Canada",
    price: 11.9,
    minDays: 4,
    maxDays: 10,
  },
  {
    id: "asia",
    label: "Asia",
    price: 12.9,
    minDays: 4,
    maxDays: 10,
  },
  {
    id: "row",
    label: "Rest of World",
    price: 14.9,
    minDays: 5,
    maxDays: 12,
  },
] as const;

export type ShippingZoneId = (typeof SHIPPING_ZONES)[number]["id"];

export function getShippingZone(id: ShippingZoneId) {
  return SHIPPING_ZONES.find((z) => z.id === id)!;
}
