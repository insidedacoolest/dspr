"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "dspr_cart_v1";

function sameLine(a, id, size) {
  return a.id === id && (a.size || null) === (size || null);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved cart after mount (localStorage doesn't exist during SSR).
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(CART_KEY));
        if (Array.isArray(stored)) setItems(stored);
      } catch {
        // ignore invalid stored cart
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, product.id, product.size));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, product.id, product.size) ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  }

  function updateQty(id, size, qty) {
    if (qty <= 0) {
      removeItem(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((p) => (sameLine(p, id, size) ? { ...p, qty } : p))
    );
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((p) => !sameLine(p, id, size)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalQty, totalPrice, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
