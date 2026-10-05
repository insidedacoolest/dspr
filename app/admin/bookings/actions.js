"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

export async function updateBooking(id, formData) {
  await requireAdmin();
  await prisma.booking.update({
    where: { id },
    data: {
      status: String(formData.get("status") || "new"),
      adminNotes: String(formData.get("adminNotes") || ""),
    },
  });
  revalidatePath("/admin", "layout");
}

export async function deleteBooking(id) {
  await requireAdmin();
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/bookings");
}
