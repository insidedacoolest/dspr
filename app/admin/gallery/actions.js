"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";

function refresh() {
  revalidatePath("/drift");
  revalidatePath("/admin/gallery");
}

export async function uploadImages(formData) {
  await requireAdmin();
  const caption = String(formData.get("caption") || "").trim();
  const files = formData.getAll("images").filter((f) => f && typeof f === "object" && f.size > 0);
  for (const file of files) {
    const url = await saveUploadedImage(file, "gallery");
    if (url) await prisma.galleryImage.create({ data: { imageUrl: url, caption, section: "drift" } });
  }
  refresh();
}

export async function updateImage(id, formData) {
  await requireAdmin();
  await prisma.galleryImage.update({
    where: { id },
    data: { caption: String(formData.get("caption") || "").trim(), order: Number(formData.get("order") || 0) },
  });
  refresh();
}

export async function deleteImage(id) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  refresh();
}
