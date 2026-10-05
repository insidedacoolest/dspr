import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import ProductForm from "../ProductForm";
import { updateProduct, deleteProduct } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Edit product — Admin" };

export default async function EditarProdutoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) || 0 } });
  if (!product) notFound();

  return (
    <>
      <div className="admin-head">
        <div><h1>Edit product</h1><p><Link href="/admin/products">← Back to products</Link></p></div>
        <Link href={`/shop/${product.id}`} target="_blank" className="btn btn-ghost btn-sm"><span>View in shop ↗</span></Link>
      </div>
      <ProductForm action={updateProduct.bind(null, product.id)} initial={product} submitLabel="Save changes" />
      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteProduct.bind(null, product.id)}><ConfirmButton>Delete product</ConfirmButton></form>
      </div>
    </>
  );
}
