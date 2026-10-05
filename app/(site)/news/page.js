import Link from "next/link";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import Media from "../../components/Media";
import PageHead from "../../components/PageHead";

export const dynamic = "force-dynamic";
export const metadata = { title: "News" };

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <PageHead crumb="News" eyebrow="From the paddock" title="News" outline="& episodes" lede="Race weekends, builds and updates from the team, the garage and the shop." ghost="News" />
      <section className="sec grey">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="lede">No news yet.</p>
          ) : (
            <div className="news-grid all">
              {posts.map((n, i) => (
                <Link href={`/news/${n.id}`} className={`post${i === 0 ? " lead" : ""}`} key={n.id}>
                  <div className="img"><Media src={n.imageUrl} alt={n.title} label={n.section} /><span className="tag">{n.section}</span></div>
                  <div className="post-body">
                    <time>{fmtDate(n.publishedAt)}</time>
                    <h3>{n.title}</h3>
                    <p>{n.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
