import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { productToView } from "../../../lib/views";
import { categoryLabel, SHOP_SECTIONS } from "../../../lib/constants";
import ProductGallery from "../../../components/ProductGallery";
import ProductDetailActions from "../../../components/ProductDetailActions";
import ProductCard from "../../../components/ProductCard";
import Icon from "../../../components/Icon";
import Cta from "../../../components/Cta";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!row) return { title: "Product" };
  return { title: `${row.name} — Shop`, description: row.description || undefined };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!row) notFound();
  const product = productToView(row);
  const isPart = product.section === "parts";
  const sectionLabel = SHOP_SECTIONS.find((x) => x.value === product.section)?.label;

  const related = (
    await prisma.product.findMany({ where: { section: product.section, id: { not: product.id } }, orderBy: { id: "desc" }, take: 8 })
  )
    .map(productToView)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 4);

  return (
    <>
      <div className="page-head" style={{ minHeight: 0, paddingBottom: 30 }}>
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href={`/shop?s=${product.section}`}>Shop · {sectionLabel}</Link> / {product.name}</div>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: 60 }}>
        <div className="wrap product-detail">
          <ProductGallery product={product} />
          <div>
            <div className="pd-head">
              <span className="eyebrow">{product.brand ? `${product.brand} · ` : ""}{categoryLabel(product.section, product.category)}</span>
              <h1 className="disp">{product.name}</h1>
              {product.sku && <span className="pd-sku">SKU {product.sku}</span>}
            </div>

            {isPart && product.fitment && <div className="fitment"><b>Fitment</b>{product.fitment}</div>}
            {product.description && <p className="lede">{product.description}</p>}

            <ProductDetailActions product={product} />

            <span className={`stock${product.inStock ? "" : " out"}`}>{product.inStock ? "In stock" : "Sold out — ask us about restocks"}</span>

            <div className="perks">
              <div><Icon name="flag" size={20} /><span><b>Local pickup</b>Skip shipping — choose pickup at checkout.</span></div>
              <div><Icon name="mail" size={20} /><span><b>Personal confirmation</b>We confirm stock and payment with you before anything ships.</span></div>
              {isPart && <div><Icon name="wrench" size={20} /><span><b>We can install it</b><Link href="/garage#book" style={{ textDecoration: "underline" }}>Book the install</Link> at the shop.</span></div>}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec grey">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow">Keep shopping</span><h2 className="disp">You might <span className="o-ink">also</span> like</h2></div>
              <Cta href={`/shop?s=${product.section}`} tone="dark">View all</Cta>
            </div>
            <div className="products">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
