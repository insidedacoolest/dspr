import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import ServiceForm from "../ServiceForm";
import { createService } from "../actions";

export const metadata = { title: "New service — Admin" };

export default async function NovoServicoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>New service</h1><p><Link href="/admin/services">← Back</Link></p></div></div>
      <ServiceForm action={createService} submitLabel="Create service" />
    </>
  );
}
