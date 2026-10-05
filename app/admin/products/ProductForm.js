import { SHOP_SECTIONS, SHOP_CATEGORIES } from "../../lib/constants";

function variantsToText(json) {
  try {
    return JSON.parse(json || "[]").map((v) => `${v.label},${v.price}`).join("\n");
  } catch {
    return "";
  }
}

export default function ProductForm({ action, initial, submitLabel }) {
  const images = JSON.parse(initial?.imagesJson || "[]");
  const current = initial ? `${initial.section}:${initial.category}` : "merch:apparel";

  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Basics</legend>
        <label className="field">
          <span>Product name</span>
          <input name="name" required defaultValue={initial?.name} />
        </label>
        <label className="field">
          <span>Section & category</span>
          <select name="sectionCategory" defaultValue={current}>
            {SHOP_SECTIONS.map((s) => (
              <optgroup key={s.value} label={s.long}>
                {SHOP_CATEGORIES[s.value].map((c) => (
                  <option key={c.value} value={`${s.value}:${c.value}`}>{s.label} — {c.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Description</span>
          <textarea name="description" rows={4} defaultValue={initial?.description} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Photos</legend>
        {images.length > 0 && (
          <div className="image-grid">
            {images.map((url) => (
              <label key={url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <span className="check"><input type="checkbox" name="removeImages" value={url} /> Remove</span>
              </label>
            ))}
          </div>
        )}
        <input type="file" name="images" accept="image/*" multiple />
        <span className="hint">You can pick several photos. The first one is the cover. Recommended ratio 4:5 (e.g. 1200×1500px), up to 20MB.</span>
      </fieldset>

      <fieldset>
        <legend>Price & stock</legend>
        <div className="form-row">
          <label className="field">
            <span>Price ($)</span>
            <input type="number" step="0.01" min="0" name="price" required defaultValue={initial?.price} />
          </label>
          <label className="field">
            <span>Old price (sale, optional)</span>
            <input type="number" step="0.01" min="0" name="oldPrice" defaultValue={initial?.oldPrice ?? ""} />
          </label>
        </div>
        <label className="check"><input type="checkbox" name="inStock" defaultChecked={initial ? initial.inStock : true} /> In stock (available to buy)</label>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Feature on the home page</label>
      </fieldset>

      <fieldset>
        <legend>Sizes / variants</legend>
        <label className="field">
          <span>Sizes (same price, comma separated)</span>
          <input name="sizes" placeholder="S,M,L,XL,2XL" defaultValue={initial?.sizesCsv || ""} />
        </label>
        <label className="field">
          <span>Variants with their own price (one per line: Name,Price)</span>
          <textarea name="variants" rows={4} placeholder={"White,20\nHolographic,28"} defaultValue={variantsToText(initial?.variantsJson)} />
          <span className="hint">If you fill in variants, they replace the sizes in the shop.</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Parts only</legend>
        <div className="form-row">
          <label className="field">
            <span>Brand</span>
            <input name="brand" defaultValue={initial?.brand} />
          </label>
          <label className="field">
            <span>SKU</span>
            <input name="sku" defaultValue={initial?.sku} />
          </label>
        </div>
        <label className="field">
          <span>Fitment</span>
          <input name="fitment" placeholder="e.g. Lexus IS300 / Nissan 240SX" defaultValue={initial?.fitment} />
        </label>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-pink"><span>{submitLabel}</span></button>
      </div>
    </form>
  );
}
