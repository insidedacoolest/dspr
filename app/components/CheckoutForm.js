"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { createOrder } from "../actions/shop";
import { usd } from "../lib/format";
import { shippingCost } from "../lib/shipping";
import PayPalButtons from "./PayPalButtons";

const EMPTY = { name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", delivery: "ship", notes: "" };

export default function CheckoutForm({ note, shippingNote, rules, paypalClientId, devSimulate }) {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState("details");
  const [order, setOrder] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const shipPreview = shippingCost(totalPrice, form.delivery, rules);

  async function handleDetails(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await createOrder({ ...form, items });
    setPending(false);
    if (result?.error) return setError(result.error);
    setOrder(result);
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const onPaid = useCallback(() => {
    clearCart();
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearCart]);

  const onPayError = useCallback((message) => setError(message), []);

  async function simulate() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/dev/simulate-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: order.orderId, token: order.token }) });
    setPending(false);
    if (res.ok) onPaid();
    else setError("Simulated payment failed.");
  }

  if (step === "done") {
    return (
      <div className="checkout-done">
        <span className="eyebrow">Order #{order.orderId} · paid</span>
        <h2>Checkered flag!</h2>
        <p className="lede">
          Thanks, {form.name.split(" ")[0]}. Your payment was received and a confirmation is on its way to <b>{form.email}</b>.
          {form.delivery === "ship" ? " We’ll email you again when it ships." : " We’ll contact you to set a pickup time."}
        </p>
        <Link href="/shop" className="btn btn-teal"><span>Back to the shop</span></Link>
      </div>
    );
  }

  if (items.length === 0 && step === "details") {
    return (
      <div className="checkout-done">
        <p className="lede">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-teal"><span>Browse products</span></Link>
      </div>
    );
  }

  const subtotal = order ? order.subtotal : totalPrice;
  const shipping = order ? order.shipping : shipPreview;
  const total = order ? order.total : totalPrice + shipPreview;

  return (
    <div className="checkout-grid">
      {step === "details" ? (
        <form className="form" onSubmit={handleDetails}>
          <h3 className="form-title"><em>01</em> Your details</h3>
          <label className="field">
            <span>Full name</span>
            <input type="text" required autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>
          <div className="form-row">
            <label className="field">
              <span>Email</span>
              <input type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>
            <label className="field">
              <span>Phone</span>
              <input type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>
          </div>

          <h3 className="form-title"><em>02</em> Delivery</h3>
          <div className="radio-cards">
            {[
              ["ship", "Ship it", shippingNote || "Shipping within the US"],
              ["pickup", "Pick up at the shop", "Free — we’ll set a time"],
            ].map(([value, title, sub]) => (
              <label key={value} className={`radio-card${form.delivery === value ? " active" : ""}`}>
                <input type="radio" name="delivery" value={value} checked={form.delivery === value} onChange={() => update("delivery", value)} />
                <b>{title}</b>
                <small>{sub}</small>
              </label>
            ))}
          </div>
          {form.delivery === "ship" && (
            <>
              <label className="field">
                <span>Street address</span>
                <input type="text" required autoComplete="street-address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </label>
              <div className="form-row-3">
                <label className="field">
                  <span>City</span>
                  <input type="text" required autoComplete="address-level2" value={form.city} onChange={(e) => update("city", e.target.value)} />
                </label>
                <label className="field">
                  <span>State</span>
                  <input type="text" required autoComplete="address-level1" placeholder="UT" value={form.state} onChange={(e) => update("state", e.target.value)} />
                </label>
                <label className="field">
                  <span>ZIP</span>
                  <input type="text" required inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
                </label>
              </div>
            </>
          )}
          <label className="field">
            <span>Notes (optional)</span>
            <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="For parts: tell us the car / chassis so we can double-check fitment." />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="cta" disabled={pending}>
            <i aria-hidden="true">»</i><span>{pending ? "Saving…" : "Continue to payment"}</span>
          </button>
        </form>
      ) : (
        <div className="form">
          <h3 className="form-title"><em>03</em> Payment</h3>
          <div className="pay-summary">
            <div><small>Order</small><b>#{order.orderId}</b></div>
            <div><small>{form.delivery === "ship" ? "Ship to" : "Delivery"}</small><b>{form.delivery === "ship" ? `${form.city}, ${form.state}` : "Pickup"}</b></div>
            <button type="button" className="link-btn" onClick={() => { setStep("details"); setOrder(null); setError(null); }}>Edit details</button>
          </div>
          <p className="fine">{note}</p>

          {paypalClientId ? (
            <PayPalButtons clientId={paypalClientId} orderId={order.orderId} token={order.token} onPaid={onPaid} onError={onPayError} />
          ) : devSimulate ? (
            <div className="dev-pay">
              <p><b>Development mode:</b> PayPal isn’t configured yet (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET). You can simulate a successful payment to test the confirmation emails.</p>
              <button type="button" className="btn btn-yellow" onClick={simulate} disabled={pending}><span>{pending ? "Processing…" : "Simulate successful payment"}</span></button>
            </div>
          ) : (
            <p className="form-error">Online payment isn’t available right now. Please contact us to complete your order #{order.orderId}.</p>
          )}

          {error && <p className="form-error">{error}</p>}
          <p className="fine">🔒 Payments are processed securely by PayPal. We never see or store your card details.</p>
        </div>
      )}

      <aside className="checkout-summary">
        <h3 className="form-title">Summary</h3>
        {items.map((item) => (
          <div className="summary-line" key={`${item.id}-${item.size || "u"}`}>
            <span>{item.qty}× {item.name}{item.size ? <small> · {item.size}</small> : null}</span>
            <b>{usd(item.price * item.qty)}</b>
          </div>
        ))}
        <div className="summary-line sub"><span>Subtotal</span><b>{usd(subtotal)}</b></div>
        <div className="summary-line sub"><span>{form.delivery === "pickup" ? "Pickup" : "Shipping"}</span><b>{shipping > 0 ? usd(shipping) : "Free"}</b></div>
        {form.delivery === "ship" && rules.freeOver > 0 && subtotal < rules.freeOver && (
          <p className="fine">Add {usd(rules.freeOver - subtotal)} more for free shipping.</p>
        )}
        <div className="summary-total"><span>Total</span><b>{usd(total)}</b></div>
        <p className="fine">All prices in USD.</p>
      </aside>
    </div>
  );
}
