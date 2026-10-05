"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

function readFields(formData) {
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "09:00");
  const end = String(formData.get("endDate") || "");
  return {
    title: String(formData.get("title") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    date: new Date(`${date}T${time}:00`),
    endDate: end ? new Date(`${end}T23:59:00`) : null,
    kind: String(formData.get("kind") || "comp"),
    desc: String(formData.get("desc") || "").trim(),
    result: String(formData.get("result") || "").trim(),
    link: String(formData.get("link") || "").trim() || null,
  };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/drift");
  revalidatePath("/admin", "layout");
}

export async function createEvent(formData) {
  await requireAdmin();
  await prisma.event.create({ data: readFields(formData) });
  refresh();
  redirect("/admin/events");
}

export async function updateEvent(id, formData) {
  await requireAdmin();
  await prisma.event.update({ where: { id }, data: readFields(formData) });
  refresh();
  redirect("/admin/events");
}

export async function deleteEvent(id) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  refresh();
  redirect("/admin/events");
}
