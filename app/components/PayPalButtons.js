"use client";

import { useEffect, useRef, useState } from "react";

// Loads the PayPal JS SDK once and renders two buttons: PayPal and
// "Debit or Credit Card" (guest card checkout, no PayPal account needed).
let sdkPromise;
function loadSdk(clientId) {
  if (typeof window !== "undefined" && window.paypal) return Promise.resolve(window.paypal);
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons&enable-funding=card`;
      s.async = true;
      s.onload = () => resolve(window.paypal);
      s.onerror = () => {
        sdkPromise = null;
        reject(new Error("Could not load PayPal. Check your connection and try again."));
      };
      document.head.appendChild(s);
    });
  }
  return sdkPromise;
}

async function post(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Payment error");
    err.declined = data.declined;
    throw err;
  }
  return data;
}

export default function PayPalButtons({ clientId, orderId, token, onPaid, onError }) {
  const paypalRef = useRef(null);
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  // Latest callbacks without re-rendering the PayPal buttons on every parent render.
  const handlers = useRef({ onPaid, onError });
  useEffect(() => {
    handlers.current = { onPaid, onError };
  }, [onPaid, onError]);

  useEffect(() => {
    let cancelled = false;
    const rendered = [];

    loadSdk(clientId)
      .then((paypal) => {
        if (cancelled) return;
        const config = (fundingSource) => ({
          fundingSource,
          style: { layout: "vertical", shape: "rect", height: 50, label: "pay", color: fundingSource === paypal.FUNDING.PAYPAL ? "gold" : "black" },
          createOrder: async () => (await post("/api/paypal/create-order", { orderId, token })).id,
          onApprove: async (_data, actions) => {
            try {
              await post("/api/paypal/capture-order", { orderId, token });
              handlers.current.onPaid();
            } catch (e) {
              // Declined card: let the buyer pick another funding source.
              if (e.declined) return actions.restart();
              handlers.current.onError(e.message);
            }
          },
          onError: () => handlers.current.onError("Something went wrong with the payment. Please try again."),
        });
        for (const [source, ref] of [[paypal.FUNDING.PAYPAL, paypalRef], [paypal.FUNDING.CARD, cardRef]]) {
          const btn = paypal.Buttons(config(source));
          if (btn.isEligible() && ref.current) {
            btn.render(ref.current);
            rendered.push(btn);
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      rendered.forEach((b) => b.close?.());
    };
  }, [clientId, orderId, token]);

  return (
    <div className="pay-buttons">
      {loading && <p className="fine">Loading secure payment…</p>}
      {loadError && <p className="form-error">{loadError}</p>}
      <div ref={paypalRef} />
      <div ref={cardRef} />
    </div>
  );
}
