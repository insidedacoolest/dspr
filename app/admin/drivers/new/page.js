import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import DriverForm from "../DriverForm";
import { createDriver } from "../actions";

export const metadata = { title: "New driver — Admin" };

export default async function NewDriverPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>New driver</h1><p><Link href="/admin/drivers">← Back</Link></p></div></div>
      <DriverForm action={createDriver} submitLabel="Create driver" />
    </>
  );
}
