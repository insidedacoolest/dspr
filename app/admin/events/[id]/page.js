import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import EventForm from "../EventForm";
import { updateEvent, deleteEvent } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Edit event — Admin" };

export default async function EditarEventoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id: Number(id) || 0 } });
  if (!event) notFound();
  return (
    <>
      <div className="admin-head"><div><h1>Edit event</h1><p><Link href="/admin/events">← Back</Link></p></div></div>
      <EventForm action={updateEvent.bind(null, event.id)} initial={event} submitLabel="Save changes" />
      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteEvent.bind(null, event.id)}><ConfirmButton>Delete event</ConfirmButton></form>
      </div>
    </>
  );
}
