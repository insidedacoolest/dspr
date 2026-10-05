"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export default function AddToCartButton({ id, name, price, size, qty = 1, disabled, className = "" }) {
  const { addItem, setOpen } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ id, name, price, size: size || undefined }, qty);
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button className={`btn btn-pink btn-lg ${className}`.trim()} type="button" onClick={handleClick} disabled={disabled}>
      <span>{disabled ? "Sold out" : added ? "Added ✓" : "Add to cart"}</span>
    </button>
  );
}
