"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

function readFields(formData) {
  return {
    year: String(formData.get("year") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    text: String(formData.get("text") || "").trim(),
    order: Number(formData.get("order") || 0),
  };
}

function refresh() {
  revalidatePath("/about");
  revalidatePath("/admin/milestones");
}

export async function createMilestone(formData) {
  await requireAdmin();
  const data = readFields(formData);
  if (!data.year || !data.title) return;
  await prisma.milestone.create({ data });
  refresh();
}

export async function updateMilestone(id, formData) {
  await requireAdmin();
  await prisma.milestone.update({ where: { id }, data: readFields(formData) });
  refresh();
}

export async function deleteMilestone(id) {
  await requireAdmin();
  await prisma.milestone.delete({ where: { id } });
  refresh();
}
