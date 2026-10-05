import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { productToView } from "../../lib/views";
import ShopBrowser from "../../components/ShopBrowser";
import PageHead from "../../components/PageHead";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return { title: `Shop — ${s.brandFull}`, description: s.shopLede };
}

export default async function ShopPage({ searchParams }) {
  const { s: section } = await searchParams;
  const [s, rows] = await Promise.all([getSettings(), prisma.product.findMany({ orderBy: [{ featured: "desc" }, { id: "desc" }] })]);

  return (
    <>
      <PageHead crumb="Shop" eyebrow="This is the official shop" title="Team" outline="gear" lede={s.shopLede} ghost="Shop" />
      <section className="sec grey">
        <div className="wrap">
          <ShopBrowser products={rows.map(productToView)} initialSection={section === "parts" ? "parts" : "merch"} />
        </div>
      </section>
    </>
  );
}
