import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/admin/login");
  }
  return session;
}
