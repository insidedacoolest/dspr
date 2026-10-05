"use server";

import bcrypt from "bcryptjs";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

export async function changePassword(prevState, formData) {
  const session = await requireAdmin();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  if (next.length < 8) return { error: "The new password must be at least 8 characters." };
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Your current password is wrong." };
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}
