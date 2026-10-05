import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";

export const metadata = { title: "News — Admin" };

export default async function NoticiasAdminPage() {
  await requireAdmin();
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <>
      <div className="admin-head">
        <div><h1>News</h1><p>{posts.length} post(s).</p></div>
        <Link href="/admin/news/new" className="btn btn-pink btn-sm"><span>+ New news post</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>Title</th><th>Section</th><th>Date</th><th /></tr></thead>
          <tbody>
            {posts.map((n) => (
              <tr key={n.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 60 }}>{n.imageUrl ? <img src={n.imageUrl} alt="" className="thumb" /> : <span className="thumb" />}</td>
                <td><b>{n.title}</b><div className="muted">{n.excerpt}</div></td>
                <td style={{ textTransform: "capitalize" }}>{n.section}</td>
                <td className="muted">{fmtDate(n.publishedAt)}</td>
                <td><div className="row-actions"><Link href={`/news/${n.id}`} target="_blank">View</Link><Link href={`/admin/news/${n.id}`}>Edit</Link></div></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={5} className="muted">No news posts.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
