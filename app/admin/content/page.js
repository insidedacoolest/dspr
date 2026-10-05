import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { getSettings } from "../../lib/settings";
import { CONTENT_GROUPS } from "../../lib/content";
import { saveContent } from "./actions";
import ContentForm from "./ContentForm";

export const metadata = { title: "Site content — Admin" };

const PREVIEW = { brand: "/", contact: "/garage#book", home: "/", about: "/about", drift: "/drift", garage: "/garage", shop: "/shop", footer: "/" };

export default async function ContentPage({ searchParams }) {
  await requireAdmin();
  const { g } = await searchParams;
  const group = CONTENT_GROUPS.find((x) => x.id === g) || CONTENT_GROUPS[0];
  const values = await getSettings();

  return (
    <>
      <div className="admin-head">
        <div><h1>Site content</h1><p>Every text and photo on the public pages. Changes go live as soon as you save.</p></div>
        <Link href={PREVIEW[group.id] || "/"} target="_blank" className="btn btn-sm btn-white"><span>Preview page ↗</span></Link>
      </div>
      <div className="filter-tabs">
        {CONTENT_GROUPS.map((x) => (
          <Link key={x.id} href={`/admin/content?g=${x.id}`} className={x.id === group.id ? "active" : ""}>{x.label}</Link>
        ))}
      </div>
      <ContentForm group={group} values={values} action={saveContent.bind(null, group.id)} />
    </>
  );
}
