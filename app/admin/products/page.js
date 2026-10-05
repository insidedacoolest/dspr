import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { usd } from "../../lib/format";
import { SHOP_SECTIONS, categoryLabel } from "../../lib/constants";
import { toggleStock } from "./actions";

export const metadata = { title: "Products — Admin" };

export default async function ProdutosPage({ searchParams }) {
  await requireAdmin();
  const { s } = await searchParams;
  const products = await prisma.product.findMany({
    where: s ? { section: s } : undefined,
    orderBy: [{ section: "asc" }, { id: "desc" }],
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Products</h1><p>{products.length} product(s).</p></div>
        <Link href="/admin/products/new" className="btn btn-pink btn-sm"><span>+ New product</span></Link>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/products" className={!s ? "active" : ""}>All</Link>
        {SHOP_SECTIONS.map((x) => (
          <Link key={x.value} href={`/admin/products?s=${x.value}`} className={s === x.value ? "active" : ""}>{x.long}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>Product</th><th>Category</th><th className="num">Price</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 60 }}>{p.imageUrl ? <img src={p.imageUrl} alt="" className="thumb" /> : <span className="thumb" />}</td>
                <td>
                  <Link href={`/admin/products/${p.id}`}><b>{p.name}</b></Link>
                  <div className="muted">{[p.brand, p.sku].filter(Boolean).join(" · ")}{p.featured ? " ★ featured" : ""}</div>
                </td>
                <td>{p.section === "parts" ? "Parts" : "Merch"} · {categoryLabel(p.section, p.category)}</td>
                <td className="num">{usd(p.price)}</td>
                <td>
                  <form action={toggleStock.bind(null, p.id)}>
                    <button className={`status ${p.inStock ? "status-done" : "status-cancelled"}`} style={{ background: "none", cursor: "pointer" }} title="Click to toggle">
                      {p.inStock ? "In stock" : "Sold out"}
                    </button>
                  </form>
                </td>
                <td><div className="row-actions"><Link href={`/shop/${p.id}`} target="_blank">View</Link><Link href={`/admin/products/${p.id}`}>Edit</Link></div></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={6} className="muted">No products yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
