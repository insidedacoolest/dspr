import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import NewsForm from "../NewsForm";
import { createNews } from "../actions";

export const metadata = { title: "New news post — Admin" };

export default async function NovaNoticiaPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>New news post</h1><p><Link href="/admin/news">← Back</Link></p></div></div>
      <NewsForm action={createNews} submitLabel="Publish" />
    </>
  );
}
