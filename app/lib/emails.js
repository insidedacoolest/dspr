import "server-only";
import { usd, fmtDate } from "./format";

// Branded, email-client-safe HTML (tables + inline styles only).

const C = { ink: "#08090a", teal: "#00cfbd", pink: "#eb008c", paper: "#f3f4f4", dim: "#6b7175" };

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function layout({ settings, preheader, title, intro, body }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:${C.paper};font-family:Arial,Helvetica,sans-serif;color:${C.ink}">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff">
  <tr><td style="background:${C.pink};height:6px;font-size:0;line-height:0">&nbsp;</td></tr>
  <tr><td style="background:${C.ink};padding:26px 30px">
    <div style="font-family:Impact,'Arial Black',sans-serif;font-size:34px;letter-spacing:1px;color:#fff;line-height:1">${esc(settings.brandName || "DSPR")}</div>
    <div style="font-size:10px;letter-spacing:6px;color:${C.teal};font-weight:bold;text-transform:uppercase;margin-top:4px">${esc(settings.brandSub || "")}</div>
  </td></tr>
  <tr><td style="padding:32px 30px 8px">
    <div style="font-family:Impact,'Arial Black',sans-serif;font-size:30px;text-transform:uppercase;line-height:1.05">${esc(title)}</div>
    <p style="font-size:15px;line-height:1.6;color:#333;margin:14px 0 0">${intro}</p>
  </td></tr>
  <tr><td style="padding:16px 30px 30px">${body}</td></tr>
  <tr><td style="background:${C.ink};color:#b9bec1;padding:22px 30px;font-size:12px;line-height:1.7">
    <strong style="color:#fff">${esc(settings.brandFull)}</strong><br>
    ${esc(settings.address)}, ${esc(settings.city)}<br>
    ${esc(settings.phone)} · <a href="mailto:${esc(settings.email)}" style="color:${C.teal}">${esc(settings.email)}</a>
  </td></tr>
  <tr><td style="background:${C.teal};height:6px;font-size:0;line-height:0">&nbsp;</td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(order) {
  const rows = order.items
    .map(
      (i) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #e7e9ea;font-size:14px"><strong>${esc(i.productName)}</strong>${i.size ? `<br><span style="color:${C.dim};font-size:12px">${esc(i.size)}</span>` : ""}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e7e9ea;font-size:14px;text-align:center;color:${C.dim}">×${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e7e9ea;font-size:14px;text-align:right">${usd(i.price * i.qty)}</td>
    </tr>`
    )
    .join("");
  const line = (label, value, strong) =>
    `<tr><td colspan="2" style="padding:6px 0;font-size:${strong ? 16 : 14}px;${strong ? "font-weight:bold" : `color:${C.dim}`}">${label}</td><td style="padding:6px 0;text-align:right;font-size:${strong ? 18 : 14}px;${strong ? `font-weight:bold;color:${C.pink}` : ""}">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows}
    ${line("Subtotal", usd(order.subtotal))}
    ${line(order.delivery === "pickup" ? "Pickup at the shop" : "Shipping", order.shipping > 0 ? usd(order.shipping) : "Free")}
    ${line("Total paid", usd(order.total), true)}
  </table>`;
}

function box(title, html) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:${C.paper}">
    <tr><td style="padding:16px 18px;font-size:14px;line-height:1.6">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.pink};font-weight:bold;margin-bottom:6px">${title}</div>${html}
    </td></tr></table>`;
}

function deliveryHtml(order) {
  if (order.delivery === "pickup") return "Pickup at the shop — we’ll reach out to set a time.";
  return `${esc(order.name)}<br>${esc(order.address)}<br>${esc(order.city)}, ${esc(order.state)} ${esc(order.zip)}<br>${esc(order.country)}`;
}

export function customerOrderEmail(order, settings, siteUrl) {
  const first = String(order.name).split(" ")[0];
  return {
    subject: `Order #${order.id} confirmed — ${settings.brandFull}`,
    html: layout({
      settings,
      preheader: `Thanks ${first}! Your payment of ${usd(order.total)} was received.`,
      title: `Order #${order.id} confirmed`,
      intro: `Thanks, ${esc(first)}! We received your payment and your order is now in the pit lane. We’ll email you again when it ships.`,
      body:
        itemsTable(order) +
        box(order.delivery === "pickup" ? "Pickup" : "Shipping to", deliveryHtml(order)) +
        box("Payment", `${esc(order.paymentMethod || "PayPal")} · ${fmtDate(order.paidAt || new Date())}`) +
        (siteUrl ? `<p style="margin:26px 0 0;text-align:center"><a href="${esc(siteUrl)}/shop" style="display:inline-block;background:${C.teal};color:${C.ink};font-weight:bold;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:14px 26px">» Back to the shop</a></p>` : ""),
    }),
    text: `Order #${order.id} confirmed. Total paid: ${usd(order.total)}.`,
  };
}

export function sellerOrderEmail(order, settings, siteUrl) {
  return {
    subject: `New paid order #${order.id} — ${usd(order.total)}`,
    html: layout({
      settings,
      preheader: `${order.name} paid ${usd(order.total)} via ${order.paymentMethod}.`,
      title: `New order #${order.id}`,
      intro: `<strong>${esc(order.name)}</strong> just paid <strong>${usd(order.total)}</strong> via ${esc(order.paymentMethod)}.`,
      body:
        itemsTable(order) +
        box("Customer", `${esc(order.name)}<br><a href="mailto:${esc(order.email)}">${esc(order.email)}</a><br>${esc(order.phone)}`) +
        box(order.delivery === "pickup" ? "Pickup at the shop" : "Ship to", deliveryHtml(order)) +
        (order.notes ? box("Customer notes", esc(order.notes).replace(/\n/g, "<br>")) : "") +
        box("PayPal", `Order ${esc(order.paypalOrderId || "—")}<br>Capture ${esc(order.paypalCaptureId || "—")}`) +
        (siteUrl ? `<p style="margin:26px 0 0;text-align:center"><a href="${esc(siteUrl)}/admin/orders/${order.id}" style="display:inline-block;background:${C.ink};color:#fff;font-weight:bold;text-transform:uppercase;letter-spacing:1px;text-decoration:none;padding:14px 26px">» Open in admin</a></p>` : ""),
    }),
    text: `New paid order #${order.id} from ${order.name} — ${usd(order.total)}.`,
  };
}
