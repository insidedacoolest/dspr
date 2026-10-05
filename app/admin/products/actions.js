"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";

function parseVariants(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.lastIndexOf(",");
      const label = (idx > 0 ? line.slice(0, idx) : line).trim();
      const price = Number((idx > 0 ? line.slice(idx + 1) : "0").trim().replace(",", "."));
      return { label, price };
    })
    .filter((v) => v.label && Number.isFinite(v.price));
}

function readFields(formData) {
  const oldPriceRaw = String(formData.get("oldPrice") || "").trim();
  const [section, category] = String(formData.get("sectionCategory") || "merch:apparel").split(":");
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    section,
    category,
    brand: String(formData.get("brand") || "").trim(),
    sku: String(formData.get("sku") || "").trim(),
    fitment: String(formData.get("fitment") || "").trim(),
    price: Number(formData.get("price") || 0),
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : null,
    sizesCsv: String(formData.get("sizes") || "").trim() || null,
    variantsJson: JSON.stringify(parseVariants(formData.get("variants"))),
    inStock: formData.get("inStock") === "on",
    featured: formData.get("featured") === "on",
  };
}

async function saveNewImages(formData) {
  const files = formData.getAll("images").filter((f) => f && typeof f === "object" && f.size > 0);
  const urls = [];
  for (const file of files) {
    const url = await saveUploadedImage(file, "products");
    if (url) urls.push(url);
  }
  return urls;
}

function revalidateShop(id) {
  revalidatePath("/");
  revalidatePath("/shop");
  if (id) revalidatePath(`/shop/${id}`);
  revalidatePath("/admin", "layout");
}

export async function createProduct(formData) {
  await requireAdmin();
  const data = readFields(formData);
  const images = await saveNewImages(formData);
  data.imagesJson = JSON.stringify(images);
  data.imageUrl = images[0] || null;
  await prisma.product.create({ data });
  revalidateShop();
  redirect("/admin/products");
}

export async function updateProduct(id, formData) {
  await requireAdmin();
  const data = readFields(formData);
  const existing = await prisma.product.findUnique({ where: { id }, select: { imagesJson: true } });
  const remove = formData.getAll("removeImages");
  const kept = JSON.parse(existing?.imagesJson || "[]").filter((url) => !remove.includes(url));
  const images = [...kept, ...(await saveNewImages(formData))];
  data.imagesJson = JSON.stringify(images);
  data.imageUrl = images[0] || null;
  await prisma.product.update({ where: { id }, data });
  revalidateShop(id);
  redirect("/admin/products");
}

export async function toggleStock(id) {
  await requireAdmin();
  const p = await prisma.product.findUnique({ where: { id }, select: { inStock: true } });
  if (p) await prisma.product.update({ where: { id }, data: { inStock: !p.inStock } });
  revalidateShop(id);
}

export async function deleteProduct(id) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidateShop(id);
  redirect("/admin/products");
}
