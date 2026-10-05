"use client";

import { useState } from "react";
import Media from "./Media";
import { productGlyph } from "./Icon";

export default function ProductGallery({ product }) {
  const [active, setActive] = useState(0);
  const images = product.images || [];

  return (
    <div className="product-gallery">
      <Media src={images[active]} alt={product.name} icon={productGlyph(product)} className="product-gallery-main" light />
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
