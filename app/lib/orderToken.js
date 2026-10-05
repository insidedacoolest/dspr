import "server-only";
import crypto from "crypto";

// Signed reference for an order, handed to the browser after checkout so the
// payment endpoints only act on orders that were created by that visitor.
export function orderToken(orderId) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET || "dev").update(`order:${orderId}`).digest("hex").slice(0, 32);
}

export function checkOrderToken(orderId, token) {
  const expected = orderToken(orderId);
  const given = String(token || "");
  return given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
