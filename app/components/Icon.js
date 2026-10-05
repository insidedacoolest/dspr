// Minimal line-icon set (24px grid, currentColor stroke) for services,
// product placeholders and UI chrome.
const PATHS = {
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  gauge: <><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16l4.5-5.5" /><circle cx="12" cy="16" r="1.4" /><path d="M6 12.5l1 .6M12 8v1.2M18 12.5l-1 .6" /></>,
  turbo: <><circle cx="11" cy="12" r="7" /><circle cx="11" cy="12" r="2" /><path d="M11 5c2 2 2 4 0 5M18 12c-2 2-4 2-5 0M11 19c-2-2-2-4 0-5M4 12c2-2 4-2 5 0" /><path d="M18 8h3v4" /></>,
  coilover: <><path d="M9 3h6M9 21h6M12 3v3M12 18v3" /><path d="M8 6l8 2-8 2 8 2-8 2 8 2-8 2" /></>,
  steering: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" /><path d="M3.5 10.5h6M14.5 10.5h6M12 14.5V21" /></>,
  brake: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M17 5.5a9 9 0 0 1 3 5" strokeWidth="3.2" /></>,
  engine: <><path d="M4 9h3l2-2h5l2 2h2v3h2v-2h1v6h-1v-2h-2v3h-3l-2 2H9l-2-2H4z" /><path d="M2 11v4" /></>,
  weld: <><path d="M4 20l7-7M9 11l4 4" /><path d="M14 4l1.2 2.6L18 7l-2.1 1.9.5 2.8-2.4-1.4-2.4 1.4.5-2.8L10 7l2.8-.4z" /></>,
  cage: <><path d="M4 20V10l8-6 8 6v10" /><path d="M4 10l16 10M20 10L4 20M12 4v16" /></>,
  tire: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1" /><path d="M2 19h20" /><path d="M7 13l3-3 2 2 4-4" /></>,
  oil: <><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>,
  shirt: <path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z" />,
  cap: <><path d="M3 15a9 9 0 0 1 18 0z" /><path d="M21 15h2v1.5H12" /><path d="M12 6v2" /></>,
  sticker: <><path d="M4 4h16v10l-6 6H4z" /><path d="M14 20v-6h6" /></>,
  bag: <><path d="M5 8h14l-1 13H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  wheel: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.8" /><path d="M12 3.5v6.7M4 9.4l6.3 1.9M6.8 19l3.9-5.4M17.2 19l-3.9-5.4M20 9.4l-6.3 1.9" /></>,
  seat: <><path d="M8 3h5l1 10H8z" /><path d="M7 13h9l2 4H6z" /><path d="M8 17v4M16 17v4" /></>,
  gear: <><path d="M6 5v14M12 5v14M18 5v7H6" /><circle cx="6" cy="4" r="1.5" /><circle cx="12" cy="4" r="1.5" /><circle cx="18" cy="4" r="1.5" /></>,
  cart: <><path d="M3 4h2.5l2.2 11h10.6L21 7H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3 7h18M3 12h12M3 17h18" />,
  pin: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 7l9 6 9-6" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h13l-2 4 2 4H5" /></>,
  check: <path d="M4 12l5 5L20 6" />,
};

export const ICON_NAMES = Object.keys(PATHS);

export default function Icon({ name, size = 24, className = "", strokeWidth = 1.6 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || PATHS.wrench}
    </svg>
  );
}

// Picks a placeholder glyph for products without photos.
export function productGlyph(product) {
  const byCat = {
    apparel: "shirt", hats: "cap", stickers: "sticker", accessories: "bag",
    suspension: "coilover", steering: "steering", engine: "turbo", brakes: "brake",
    drivetrain: "gear", wheels: "wheel", interior: "seat",
  };
  return byCat[product.category] || (product.section === "parts" ? "wrench" : "shirt");
}
