import "server-only";

// Minimal PayPal Orders v2 client (no SDK): create an order from our own DB
// totals, then capture it after the buyer approves in the PayPal popup.
// Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV=sandbox|live

const BASE = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export function paypalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function paypalClientId() {
  return process.env.PAYPAL_CLIENT_ID || "";
}

async function accessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status})`);
  return (await res.json()).access_token;
}

async function call(path, body, requestId) {
  const token = await accessToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.details?.[0]?.description || data?.message || res.statusText;
    const err = new Error(`PayPal: ${detail}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const money = (n) => (Math.round(n * 100) / 100).toFixed(2);

export async function createPayPalOrder(order, brandName) {
  return call(
    "/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: String(order.id),
          invoice_id: `DSPR-${order.id}`,
          description: `${brandName} order #${order.id}`.slice(0, 127),
          amount: {
            currency_code: "USD",
            value: money(order.total),
            breakdown: {
              item_total: { currency_code: "USD", value: money(order.subtotal) },
              shipping: { currency_code: "USD", value: money(order.shipping) },
            },
          },
          items: order.items.map((i) => ({
            name: `${i.productName}${i.size ? ` (${i.size})` : ""}`.slice(0, 127),
            quantity: String(i.qty),
            unit_amount: { currency_code: "USD", value: money(i.price) },
          })),
        },
      ],
      // Works for both the PayPal and the card button of the JS SDK.
      application_context: {
        brand_name: brandName.slice(0, 127),
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    },
    `dspr-create-${order.id}-${Math.round(order.total * 100)}`
  );
}

export async function capturePayPalOrder(paypalOrderId, orderId) {
  return call(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, null, `dspr-capture-${orderId}`);
}

// Pulls what we need out of a capture response.
export function readCapture(data) {
  const unit = data?.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const source = data?.payment_source || {};
  const method = source.card ? `Card${source.card.brand ? ` · ${source.card.brand}` : ""}${source.card.last_digits ? ` ···${source.card.last_digits}` : ""}` : "PayPal";
  return {
    status: capture?.status || data?.status,
    captureId: capture?.id || null,
    amount: Number(capture?.amount?.value || 0),
    currency: capture?.amount?.currency_code,
    referenceId: unit?.reference_id,
    method,
  };
}
