import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import DriverForm from "../DriverForm";
import { updateDriver, deleteDriver } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Edit driver — Admin" };

export default async function EditDriverPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const driver = await prisma.driver.findUnique({ where: { id: Number(id) || 0 } });
  if (!driver) notFound();
  return (
    <>
      <div className="admin-head">
        <div><h1>{driver.name}</h1><p><Link href="/admin/drivers">← Back</Link></p></div>
        <Link href={`/drift/${driver.slug}`} target="_blank" className="btn btn-ghost btn-sm"><span>View page ↗</span></Link>
      </div>
      <DriverForm action={updateDriver.bind(null, driver.id)} initial={driver} submitLabel="Save changes" />
      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteDriver.bind(null, driver.id)}><ConfirmButton>Delete driver</ConfirmButton></form>
      </div>
    </>
  );
}
