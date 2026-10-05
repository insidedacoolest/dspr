import Link from "next/link";
import { requireAdmin } from "../../../lib/authGuard";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export const metadata = { title: "New product — Admin" };

export default async function NovoProdutoPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head"><div><h1>New product</h1><p><Link href="/admin/products">← Back to products</Link></p></div></div>
      <ProductForm action={createProduct} submitLabel="Create product" />
    </>
  );
}
