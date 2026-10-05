"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";
import { slugify } from "../../lib/format";

async function readFields(formData, existing) {
  const name = String(formData.get("name") || "").trim();
  const data = {
    name,
    slug: slugify(formData.get("slug") || name) || `driver-${Date.now()}`,
    num: String(formData.get("num") || "").trim(),
    nickname: String(formData.get("nickname") || "").trim(),
    role: String(formData.get("role") || "Driver").trim(),
    car: String(formData.get("car") || "").trim(),
    engine: String(formData.get("engine") || "").trim(),
    power: Number(formData.get("power") || 0),
    specs: String(formData.get("specs") || "").trim(),
    bio: String(formData.get("bio") || "").trim(),
    instagram: String(formData.get("instagram") || "").trim(),
    order: Number(formData.get("order") || 0),
  };
  const photo = await saveUploadedImage(formData.get("image"), "drivers");
  const carPhoto = await saveUploadedImage(formData.get("carImage"), "drivers");
  data.imageUrl = photo || (formData.get("removeImage") === "on" ? null : existing?.imageUrl ?? null);
  data.carImageUrl = carPhoto || (formData.get("removeCarImage") === "on" ? null : existing?.carImageUrl ?? null);
  return data;
}

function refresh(slug) {
  revalidatePath("/");
  revalidatePath("/drift");
  if (slug) revalidatePath(`/drift/${slug}`);
  revalidatePath("/admin/drivers");
}

export async function createDriver(prevState, formData) {
  await requireAdmin();
  const data = await readFields(formData);
  if (await prisma.driver.findUnique({ where: { slug: data.slug } })) {
    return { error: `A driver with the address "${data.slug}" already exists. Change the "page address" field.` };
  }
  await prisma.driver.create({ data });
  refresh(data.slug);
  redirect("/admin/drivers");
}

export async function updateDriver(id, prevState, formData) {
  await requireAdmin();
  const existing = await prisma.driver.findUnique({ where: { id } });
  const data = await readFields(formData, existing);
  const clash = await prisma.driver.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== id) return { error: `The address "${data.slug}" is already in use.` };
  await prisma.driver.update({ where: { id }, data });
  refresh(data.slug);
  redirect("/admin/drivers");
}

export async function deleteDriver(id) {
  await requireAdmin();
  await prisma.driver.delete({ where: { id } });
  refresh();
  redirect("/admin/drivers");
}
