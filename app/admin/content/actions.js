"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { saveUploadedImage } from "../../lib/upload";
import { CONTENT_GROUPS } from "../../lib/content";

async function setValue(key, value) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

// Saves the fields of one content group. Images: a new upload replaces the
// current one, "remove" clears it, otherwise it's left untouched.
export async function saveContent(groupId, prevState, formData) {
  await requireAdmin();
  const group = CONTENT_GROUPS.find((g) => g.id === groupId);
  if (!group) return { error: "Unknown section." };
  try {
    for (const f of group.fields) {
      if (f.type === "image") {
        const url = await saveUploadedImage(formData.get(f.key), "site");
        if (url) await setValue(f.key, url);
        else if (formData.get(`remove_${f.key}`) === "on") await setValue(f.key, "");
      } else if (formData.has(f.key)) {
        await setValue(f.key, String(formData.get(f.key) || "").replace(/\r\n/g, "\n").trim());
      }
    }
  } catch (e) {
    return { error: e.message };
  }
  revalidatePath("/", "layout");
  return { saved: Date.now() };
}

export async function resetField(key) {
  await requireAdmin();
  await prisma.setting.deleteMany({ where: { key } });
  revalidatePath("/", "layout");
}
