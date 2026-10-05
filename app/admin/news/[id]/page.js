import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import NewsForm from "../NewsForm";
import { updateNews, deleteNews } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Edit news post — Admin" };

export default async function EditarNoticiaPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();
  return (
    <>
      <div className="admin-head"><div><h1>Edit news post</h1><p><Link href="/admin/news">← Back</Link></p></div></div>
      <NewsForm action={updateNews.bind(null, post.id)} initial={post} submitLabel="Save changes" />
      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteNews.bind(null, post.id)}><ConfirmButton>Delete news post</ConfirmButton></form>
      </div>
    </>
  );
}
