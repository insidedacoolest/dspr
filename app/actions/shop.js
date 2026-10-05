"use server";

import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { shippingRules, shippingCost, round2 } from "../lib/shipping";
import { orderToken } from "../lib/orderToken";

const clean = (v, max = 200) => String(v || "").trim().slice(0, max);

// Step 1 of checkout: validates the cart against the DB and creates the order
// as "awaiting_payment". Payment (PayPal / card) happens in step 2.
export async function createOrder(data) {
  const delivery = data?.delivery === "pickup" ? "pickup" : "ship";
  const f = {
    name: clean(data?.name),
    email: clean(data?.email),
    phone: clean(data?.phone, 40),
    address: clean(data?.address),
    city: clean(data?.city, 80),
    state: clean(data?.state, 40),
    zip: clean(data?.zip, 20),
    notes: clean(data?.notes, 2000),
  };
  const items = Array.isArray(data?.items) ? data.items : [];

  if (!f.name || !f.email || !f.phone) return { error: "Please fill in your name, email and phone." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return { error: "Please enter a valid email address." };
  if (delivery === "ship" && (!f.address || !f.city || !f.state || !f.zip)) {
    return { error: "Please fill in your full shipping address." };
  }
  if (items.length === 0) return { error: "Your cart is empty." };

  // Never trust prices sent by the browser: re-read every product from the
  // DB and price each line from there (variant price when one is chosen).
  const ids = [...new Set(items.map((i) => Number(i.id)).filter(Boolean))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = [];
  for (const i of items) {
    const product = byId.get(Number(i.id));
    if (!product) return { error: "One of the products in your cart no longer exists. Remove it and try again." };
    if (!product.inStock) return { error: `${product.name} is sold out. Remove it from your cart to continue.` };
    const variants = JSON.parse(product.variantsJson || "[]");
    const variant = i.size ? variants.find((v) => v.label === i.size) : null;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(i.qty) || 1)));
    lines.push({
      productId: product.id,
      productName: product.name,
      size: i.size ? String(i.size) : null,
      price: variant ? Number(variant.price) : product.price,
      qty,
    });
  }

  const settings = await getSettings();
  const subtotal = round2(lines.reduce((sum, l) => sum + l.price * l.qty, 0));
  const shipping = round2(shippingCost(subtotal, delivery, shippingRules(settings)));
  const total = round2(subtotal + shipping);

  const order = await prisma.order.create({
    data: {
      ...f,
      address: delivery === "ship" ? f.address : "Pickup at the shop",
      delivery,
      subtotal,
      shipping,
      total,
      status: "awaiting_payment",
      items: { create: lines },
    },
  });

  return { success: true, orderId: order.id, token: orderToken(order.id), subtotal, shipping, total };
}
