"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { ORDER_STATUS } from "../../lib/constants";
import { markOrderPaid } from "../../lib/orders";

export async function updateOrderStatus(id, formData) {
  await requireAdmin();
  const status = String(formData.get("status") || "");
  if (!ORDER_STATUS.some((s) => s.value === status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function resendOrderEmails(id) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order?.paidAt) return;
  await prisma.order.update({ where: { id }, data: { emailsSentAt: null } });
  await markOrderPaid(id, { method: order.paymentMethod, captureId: order.paypalCaptureId });
  revalidatePath(`/admin/orders/${id}`);
}

export async function deleteOrder(id) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/orders");
}
