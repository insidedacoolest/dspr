"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

function readFields(formData) {
  const price = String(formData.get("priceFrom") || "").trim();
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    priceFrom: price ? Number(price) : null,
    duration: String(formData.get("duration") || "").trim(),
    icon: String(formData.get("icon") || "wrench"),
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") || 0),
  };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/garage");
  revalidatePath("/admin/services");
}

export async function createService(formData) {
  await requireAdmin();
  await prisma.service.create({ data: readFields(formData) });
  refresh();
  redirect("/admin/services");
}

export async function updateService(id, formData) {
  await requireAdmin();
  await prisma.service.update({ where: { id }, data: readFields(formData) });
  refresh();
  redirect("/admin/services");
}

export async function deleteService(id) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  refresh();
  redirect("/admin/services");
}
