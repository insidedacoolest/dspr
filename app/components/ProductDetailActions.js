"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { usd } from "../lib/format";

export default function ProductDetailActions({ product }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const [variant, setVariant] = useState(hasVariants ? product.variants[0] : null);
  const [size, setSize] = useState(!hasVariants ? product.sizes?.[0] || null : null);
  const [qty, setQty] = useState(1);

  const price = hasVariants ? variant.price : product.price;
  const label = hasVariants ? variant.label : size;
  const onSale = !hasVariants && product.oldPrice && product.oldPrice > product.price;
  const options = hasVariants ? product.variants.map((v) => v.label) : product.sizes || [];

  return (
    <div className="pd-actions">
      <div className="pd-price">
        {onSale && <s>{usd(product.oldPrice)}</s>}
        <b>{usd(price)}</b>
        <small>+ tax & shipping</small>
      </div>

      {options.length > 0 && (
        <div className="pd-block">
          <span className="pd-label">{hasVariants ? "Options" : "Size"}</span>
          <div className="size-selector">
            {options.map((opt) => {
              const selected = hasVariants ? variant.label === opt : size === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`size-option${selected ? " active" : ""}`}
                  onClick={() => (hasVariants ? setVariant(product.variants.find((v) => v.label === opt)) : setSize(opt))}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="pd-block pd-buy">
        <div className="qty-stepper">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
        </div>
        <AddToCartButton id={product.id} name={product.name} price={price} size={label} qty={qty} disabled={!product.inStock} className="btn-grow" />
      </div>
    </div>
  );
}
