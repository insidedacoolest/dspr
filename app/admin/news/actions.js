"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";

async function readFields(formData, existing) {
  const date = String(formData.get("publishedAt") || "");
  const image = await saveUploadedImage(formData.get("image"), "news");
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    body: String(formData.get("body") || "").trim(),
    section: String(formData.get("section") || "drift"),
    publishedAt: date ? new Date(`${date}T12:00:00`) : new Date(),
    imageUrl: image || (formData.get("removeImage") === "on" ? null : existing?.imageUrl ?? null),
  };
}

function refresh(id) {
  revalidatePath("/");
  revalidatePath("/news");
  if (id) revalidatePath(`/news/${id}`);
  revalidatePath("/admin/news");
}

export async function createNews(formData) {
  await requireAdmin();
  await prisma.newsPost.create({ data: await readFields(formData) });
  refresh();
  redirect("/admin/news");
}

export async function updateNews(id, formData) {
  await requireAdmin();
  const existing = await prisma.newsPost.findUnique({ where: { id } });
  await prisma.newsPost.update({ where: { id }, data: await readFields(formData, existing) });
  refresh(id);
  redirect("/admin/news");
}

export async function deleteNews(id) {
  await requireAdmin();
  await prisma.newsPost.delete({ where: { id } });
  refresh(id);
  redirect("/admin/news");
}
