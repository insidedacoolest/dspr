// Shared option lists used by both the public site and the admin panel.

export const SHOP_SECTIONS = [
  { value: "merch", label: "Merch", long: "Team merch" },
  { value: "parts", label: "Parts", long: "Parts & performance" },
];

export const SHOP_CATEGORIES = {
  merch: [
    { value: "apparel", label: "Apparel" },
    { value: "hats", label: "Hats" },
    { value: "stickers", label: "Stickers & banners" },
    { value: "accessories", label: "Accessories" },
  ],
  parts: [
    { value: "suspension", label: "Suspension" },
    { value: "steering", label: "Steering & angle" },
    { value: "engine", label: "Engine & turbo" },
    { value: "brakes", label: "Brakes" },
    { value: "drivetrain", label: "Drivetrain" },
    { value: "wheels", label: "Wheels & tires" },
    { value: "interior", label: "Interior & safety" },
  ],
};

export function categoryLabel(section, value) {
  return SHOP_CATEGORIES[section]?.find((c) => c.value === value)?.label || value;
}

export const EVENT_KINDS = [
  { value: "comp", label: "Competition" },
  { value: "practice", label: "Practice day" },
  { value: "demo", label: "Demo / show" },
  { value: "trip", label: "Road trip" },
  { value: "meet", label: "Meet" },
];

export function eventKindLabel(value) {
  return EVENT_KINDS.find((k) => k.value === value)?.label || value;
}

export const BOOKING_STATUS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

export const ORDER_STATUS = [
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "paid", label: "Paid — to ship" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export function statusLabel(list, value) {
  return list.find((s) => s.value === value)?.label || value;
}

export const NEWS_SECTIONS = [
  { value: "drift", label: "Drift" },
  { value: "garage", label: "Garage" },
  { value: "shop", label: "Shop" },
];

export const SERVICE_ICONS = ["wrench", "gauge", "turbo", "coilover", "steering", "brake", "engine", "weld", "cage", "tire", "laptop", "oil"];
