// Shipping rules shared by the checkout (preview) and the server (charged amount).

function num(value) {
  const n = Number(String(value ?? "").replace(",", ".").trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function shippingRules(settings) {
  return { flat: num(settings.shippingFlat) ?? 0, freeOver: num(settings.freeShippingOver) };
}

export function shippingCost(subtotal, delivery, rules) {
  if (delivery !== "ship") return 0;
  if (rules.freeOver !== null && rules.freeOver > 0 && subtotal >= rules.freeOver) return 0;
  return rules.flat;
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}
