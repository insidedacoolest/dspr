// Turns flat DB rows (CSV/JSON text columns, since SQLite has no native
// arrays) into the shape components expect.

export function productToView(p) {
  const images = p.imagesJson ? JSON.parse(p.imagesJson) : [];
  return {
    ...p,
    sizes: p.sizesCsv ? p.sizesCsv.split(",").map((s) => s.trim()).filter(Boolean) : [],
    variants: p.variantsJson ? JSON.parse(p.variantsJson) : [],
    images: images.length > 0 ? images : p.imageUrl ? [p.imageUrl] : [],
  };
}
