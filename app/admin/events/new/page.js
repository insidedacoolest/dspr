import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import EventForm from "../EventForm";
import { createEvent } from "../actions";

export const metadata = { title: "New event — Admin" };

export default async function NovoEventoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>New event</h1><p><Link href="/admin/events">← Back</Link></p></div></div>
      <EventForm action={createEvent} submitLabel="Create event" />
    </>
  );
}
