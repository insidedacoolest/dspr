"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/partners");
}

export async function createPartner(formData) {
  await requireAdmin();
  const logoUrl = await saveUploadedImage(formData.get("logo"), "partners");
  await prisma.partner.create({
    data: {
      name: String(formData.get("name") || "").trim(),
      link: String(formData.get("link") || "").trim(),
      order: Number(formData.get("order") || 0),
      logoUrl,
    },
  });
  refresh();
}

export async function updatePartner(id, formData) {
  await requireAdmin();
  const logoUrl = await saveUploadedImage(formData.get("logo"), "partners");
  await prisma.partner.update({
    where: { id },
    data: {
      name: String(formData.get("name") || "").trim(),
      link: String(formData.get("link") || "").trim(),
      order: Number(formData.get("order") || 0),
      ...(logoUrl ? { logoUrl } : {}),
    },
  });
  refresh();
}

export async function deletePartner(id) {
  await requireAdmin();
  await prisma.partner.delete({ where: { id } });
  refresh();
}
