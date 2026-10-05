"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { usd } from "../lib/format";
import Icon from "./Icon";

export default function CartDrawer({ note }) {
  const { items, removeItem, updateQty, totalPrice, totalQty, open, setOpen } = useCart();

  return (
    <>
      <div className={`backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart-drawer${open ? " open" : ""}`} aria-label="Shopping cart" aria-hidden={!open}>
        <div className="cart-head">
          <div>
            <span className="eyebrow teal">Pit box</span>
            <h3>Cart <em>{totalQty}</em></h3>
          </div>
          <button className="icon-btn" aria-label="Close cart" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <Icon name="cart" size={40} />
              <p>Your cart is empty.<br />Time to fill the tank?</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.size || "u"}`}>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">{item.size ? `${item.size} · ` : ""}{usd(item.price)}</div>
                  <div className="qty-stepper sm">
                    <button type="button" onClick={() => updateQty(item.id, item.size, item.qty - 1)} aria-label="Decrease quantity">−</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.size, item.qty + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <b>{usd(item.price * item.qty)}</b>
                  <button className="link-btn" onClick={() => removeItem(item.id, item.size)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-foot">
          <div className="cart-total"><span>Total</span><b>{usd(totalPrice)}</b></div>
          {items.length === 0 ? (
            <button className="btn btn-pink btn-block" type="button" disabled><span>Checkout</span></button>
          ) : (
            <Link href="/shop/checkout" className="btn btn-pink btn-block" onClick={() => setOpen(false)}>
              <span>Checkout</span>
            </Link>
          )}
          {note && <p className="fine">{note}</p>}
        </div>
      </aside>
    </>
  );
}
