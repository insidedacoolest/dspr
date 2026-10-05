import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Account — Admin" };

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Account</h1>
          <p>Logged in as <b>{session.email}</b>. Contacts, texts and photos live in <Link href="/admin/content">Site content</Link>.</p>
        </div>
      </div>
      <SettingsForm />
    </>
  );
}
