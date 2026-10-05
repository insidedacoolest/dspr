import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { getSettings } from "./settings";
import { sendMail } from "./mail";
import { customerOrderEmail, sellerOrderEmail } from "./emails";

function siteUrl() {
  return (process.env.SITE_URL || "").replace(/\/$/, "");
}

// Marks an order as paid (idempotent) and sends the customer + seller emails once.
export async function markOrderPaid(orderId, { method, captureId }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  if (order.status === "awaiting_payment") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid", paidAt: new Date(), paymentMethod: method, paypalCaptureId: captureId ?? order.paypalCaptureId },
    });
  }

  const fresh = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!fresh.emailsSentAt) {
    // Claim the send first so a double capture callback can't email twice.
    const claimed = await prisma.order.updateMany({ where: { id: orderId, emailsSentAt: null }, data: { emailsSentAt: new Date() } });
    if (claimed.count === 1) {
      const settings = await getSettings();
      const url = siteUrl();
      const customer = customerOrderEmail(fresh, settings, url);
      const seller = sellerOrderEmail(fresh, settings, url);
      const results = await Promise.allSettled([
        sendMail({ to: fresh.email, replyTo: settings.email, ...customer }),
        sendMail({ to: settings.notifyEmail || settings.email, replyTo: fresh.email, ...seller }),
      ]);
      for (const r of results) if (r.status === "rejected") console.error("[mail] order email failed:", r.reason);
    }
  }

  revalidatePath("/admin", "layout");
  return fresh;
}
