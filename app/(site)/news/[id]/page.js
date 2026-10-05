import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { fmtDate } from "../../../lib/format";
import Media from "../../../components/Media";
import Cta from "../../../components/Cta";
import PageHead from "../../../components/PageHead";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  return { title: post ? post.title : "News", description: post?.excerpt };
}

export default async function NewsPostPage({ params }) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();

  return (
    <>
      <PageHead crumb="News" eyebrow={`${post.section} · ${fmtDate(post.publishedAt)}`} title={post.title} lede={post.excerpt} image={post.imageUrl} />
      <section className="sec">
        <article className="wrap article">
          {post.imageUrl && <Media src={post.imageUrl} alt={post.title} />}
          <div className="article-body">{post.body}</div>
          <div style={{ marginTop: 50 }}><Cta href="/news" tone="dark">All news</Cta></div>
        </article>
      </section>
    </>
  );
}
